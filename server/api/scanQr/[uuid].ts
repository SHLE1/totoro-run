const POLL_URL = 'https://long.open.weixin.qq.com/connect/l/qrconnect';

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid');
  if (!uuid) {
    setResponseStatus(event, 400);
    return { message: '缺少 uuid', code: null };
  }

  // 微信该接口是长轮询：未扫码时阻塞约 15 秒后返回 408。
  // 超时必须长于这个等待，否则每秒轮询都会被打断。
  try {
    const text = await $fetch<string>(`${POLL_URL}?uuid=${uuid}&f=url`, {
      signal: AbortSignal.timeout(20_000),
    });
    const match = /:\/\/oauth\?code=(\w+)&/.exec(text);
    if (match) {
      return { message: null, code: match[1] };
    }
    if (text.includes('wx_errcode=408')) {
      return { message: null, code: null };
    }
    return { message: '二维码已过期', code: null };
  } catch (error) {
    console.warn('扫码状态查询失败:', uuid, (error as Error).message);
    return { message: '扫码状态查询失败', code: null };
  }
});
