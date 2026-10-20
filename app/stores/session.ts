import type GetSunRunPaperResponse from '~~/src/types/responseTypes/GetSunRunPaperResponse';
import type { Session } from '~/types/session';

const SESSION_KEY = 'totoro:session';
const PAPER_KEY = 'totoro:sunrun-paper';

function readJson<T>(key: string): T | null {
  if (!import.meta.client) {
    return null;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (!import.meta.client) {
    return;
  }
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 存储不可用时保持内存态，登录流程仍然可用
  }
}

export const useSessionStore = defineStore('session', () => {
  const session = ref<Session | null>(readJson<Session>(SESSION_KEY));
  const paper = ref<GetSunRunPaperResponse | null>(readJson<GetSunRunPaperResponse>(PAPER_KEY));

  const isLoggedIn = computed(() => Boolean(session.value?.token));
  const basicRequest = computed(() => {
    const current = session.value;
    if (!current?.token) {
      return null;
    }
    return {
      token: current.token,
      campusId: current.campusId,
      schoolId: current.schoolId,
      stuNumber: current.stuNumber,
    };
  });

  watch(session, (value) => writeJson(SESSION_KEY, value), { deep: true });
  watch(paper, (value) => writeJson(PAPER_KEY, value), { deep: true });

  function setLogin(personalInfo: Omit<Session, 'token'>, token: string, code?: string) {
    session.value = { ...personalInfo, token, code };
    paper.value = null;
  }

  function setPaper(value: GetSunRunPaperResponse | null) {
    paper.value = value;
  }

  function clear() {
    session.value = null;
    paper.value = null;
  }

  return {
    session,
    paper,
    isLoggedIn,
    basicRequest,
    setLogin,
    setPaper,
    clear,
  };
});
