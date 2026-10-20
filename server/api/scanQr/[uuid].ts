const POLL_URL = 'https://long.open.weixin.qq.com/connect/l/qrconnect';

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid');
  if (!uuid) {
    setResponseStatus(event, 400);
    return { message: '缺少 uuid', code: null };
  }

  try {
    const text = await $fetch<string>(`${POLL_URL}?uuid=${uuid}&f=url`, {
      signal: AbortSignal.timeout(5000),
    });
    const match = /:\/\/oauth\?code=(\w+)&/.exec(text);
    return { message: null, code: match ? match[1] : null };
  } catch (error) {
    console.warn('扫码状态查询失败:', uuid, (error as Error).message);
    return { message: '扫码状态查询失败', code: null };
  }
});
