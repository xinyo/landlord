export function isWechatBrowser(userAgent = navigator.userAgent): boolean {
  return /MicroMessenger/i.test(userAgent);
}

export function isWechatRuntime(): boolean {
  return import.meta.env.MODE === 'wechat' || isWechatBrowser();
}
