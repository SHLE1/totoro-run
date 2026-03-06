import { watch } from 'vue';

const usePersistedState = <T>(
  stateKey: string,
  storageKey: string,
  defaultValue: () => T,
) => {
  const state = useState<T>(stateKey, defaultValue);
  const initialized = useState<boolean>(`${stateKey}:persisted`, () => false);

  if (import.meta.client && !initialized.value) {
    initialized.value = true;

    const rawValue = localStorage.getItem(storageKey);
    if (rawValue) {
      try {
        state.value = JSON.parse(rawValue) as T;
      } catch (error) {
        console.error(`恢复本地状态失败: ${storageKey}`, error);
        localStorage.removeItem(storageKey);
      }
    }

    watch(
      state,
      (value) => {
        try {
          if (value === null || value === undefined) {
            localStorage.removeItem(storageKey);
            return;
          }
          localStorage.setItem(storageKey, JSON.stringify(value));
        } catch (error) {
          console.error(`写入本地状态失败: ${storageKey}`, error);
        }
      },
      { deep: true },
    );
  }

  return state;
};

export default usePersistedState;
