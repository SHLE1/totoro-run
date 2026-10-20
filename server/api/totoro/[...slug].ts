import { Buffer } from 'node:buffer';
import { request as httpsRequest } from 'node:https';

const UPSTREAM_HOST = 'app.xtotoro.com';
const TIMEOUT_MS = 8000;

function postUpstream(path: string, body: string, family: 4 | 6): Promise<{ status: number; text: string }> {
  const { promise, resolve, reject } = Promise.withResolvers<{ status: number; text: string }>();
  const req = httpsRequest(
    {
      hostname: UPSTREAM_HOST,
      path,
      method: 'POST',
      family,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        'User-Agent': 'TotoroSchool/1.2.14 (iPhone; iOS 17.4.1; Scale/3.00)',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: TIMEOUT_MS,
    },
    (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode ?? 502, text: Buffer.concat(chunks).toString('utf8') });
      });
      res.on('error', reject);
    },
  );
  req.on('timeout', () => req.destroy(Object.assign(new Error('upstream-timeout'), { code: 'ETIMEDOUT' })));
  req.on('error', reject);
  req.end(body);
  return promise;
}

export default defineEventHandler(async (event) => {
  const raw = await readBody(event);
  const body = typeof raw === 'string' ? raw : JSON.stringify(raw ?? {});
  const path = event.path.replace('/api/totoro/', '/app/');

  const attempts: (4 | 6)[] = [4, 6];
  let lastError = '';
  for (const family of attempts) {
    try {
      const upstream = await postUpstream(path, body, family);
      setResponseStatus(event, upstream.status);
      try {
        return JSON.parse(upstream.text);
      } catch {
        return { header: { msg: upstream.text.slice(0, 200) || '上游返回空响应', code: '1' }, body: {} };
      }
    } catch (error) {
      const reason = (error as NodeJS.ErrnoException).code || (error as Error).message;
      lastError = `IPv${family} ${reason}`;
      console.warn('上游请求失败:', path, lastError);
    }
  }

  console.error('上游不可达:', path, lastError, UPSTREAM_HOST);
  setResponseStatus(event, 502);
  return { header: { msg: `上游不可达（${lastError}）`, code: '1' }, body: {} };
});
