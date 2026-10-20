const UPSTREAM = 'https://app.xtotoro.com';

export default defineEventHandler(async (event) => {
  const raw = await readBody(event);
  const body = typeof raw === 'string' ? raw : JSON.stringify(raw ?? {});
  const path = event.path.replace('/api/totoro/', '/app/');

  let upstream: Response;
  try {
    upstream = await fetch(`${UPSTREAM}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Host: 'app.xtotoro.com',
        Connection: 'keep-alive',
        Accept: 'application/json',
        'User-Agent': 'TotoroSchool/1.2.14 (iPhone; iOS 17.4.1; Scale/3.00)',
      },
      body,
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error('上游请求失败:', path, error);
    setResponseStatus(event, 502);
    return { header: { msg: '上游请求失败', code: '1' }, body: {} };
  }

  const text = await upstream.text();
  setResponseStatus(event, upstream.status);
  try {
    return JSON.parse(text);
  } catch {
    return { header: { msg: text.slice(0, 200) || '上游返回空响应', code: '1' }, body: {} };
  }
});
