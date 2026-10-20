
export default defineEventHandler(async (e) => {
  try {
    const scanResult = await $fetch<string>(
      `https://long.open.weixin.qq.com/connect/l/qrconnect?uuid=${e.context.params!.uuid}&f=url`,
    );
    const reg = /:\/\/oauth\?code=(\w+)&/;
    const res = reg.exec(scanResult);
    if (res === null) throw new Error('no code');
    return { message: null, code: res[1] }; //code
  } catch (e) {
    console.error(e);
    return {
      message: '扫码失败',
      code: null,
    };
  }
});
