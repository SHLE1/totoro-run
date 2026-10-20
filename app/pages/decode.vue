<script setup lang="ts">
import decryptRequestContent from '~~/src/utils/decryptRequestContent';
import encryptRequestContent from '~~/src/utils/encryptRequestContent';

useHead({ title: '请求解码 · 龙猫校园' });

const encoded = ref('');
const copied = ref(false);

const decoded = computed(() => {
  if (!encoded.value.trim()) {
    return null;
  }
  try {
    return decryptRequestContent(encoded.value);
  } catch {
    return '无法解密';
  }
});

const encrypted = computed(() => {
  if (decoded.value === null || decoded.value === '无法解密') {
    return '—';
  }
  try {
    return encryptRequestContent(decoded.value);
  } catch {
    return '无法加密';
  }
});

async function copyEncrypted() {
  try {
    await navigator.clipboard.writeText(encrypted.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <div class="page">
    <div class="shell decode">
      <section class="panel" aria-labelledby="decode-title">
        <header class="panel-head">
          <h1 id="decode-title" class="panel-title">
            请求解码
          </h1>
          <span class="mono decode-tag">本地处理</span>
        </header>

        <div class="decode-body">
          <label class="field">
            <span class="field-label">粘贴加密请求内容</span>
            <textarea
              v-model="encoded"
              class="textarea mono"
              rows="7"
              spellcheck="false"
              placeholder="粘贴服务器返回的加密字符串"
            />
          </label>

          <div class="result-grid">
            <section class="result">
              <h2>解密结果</h2>
              <pre class="mono pre-wrap">{{ JSON.stringify(decoded, null, 2) }}</pre>
            </section>

            <section class="result">
              <div class="result-head">
                <h2>重新加密</h2>
                <button type="button" class="copy" @click="copyEncrypted">
                  {{ copied ? '已复制' : '复制' }}
                </button>
              </div>
              <pre class="mono pre-wrap">{{ encrypted }}</pre>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.decode {
  max-width: 900px;
}

.decode-tag {
  color: var(--muted);
  font-size: 0.75rem;
}

.decode-body {
  display: grid;
  gap: 18px;
  padding: 20px;
}

.field {
  display: grid;
  gap: 6px;
}

.field-label {
  color: var(--muted);
  font-size: 0.75rem;
}

.textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  color: var(--ink);
  font-size: 0.8rem;
  line-height: 1.6;
  resize: vertical;
}

.textarea:focus {
  border-color: var(--blue);
  outline: none;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.result {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result h2 {
  font-size: 0.85rem;
  font-weight: 700;
}

.pre-wrap {
  margin: 0;
  padding: 14px;
  overflow: auto;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 0.75rem;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.copy {
  border: 0;
  background: none;
  color: var(--blue-strong);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 720px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
