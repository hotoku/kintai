/**
 * WEBサーバーの待受ポート
 */
export const port = (): number => {
  if (!process.env.KINTAI_PORT) {
    throw "KINTAI_PORT is not defined";
  }
  return parseInt(process.env.KINTAI_PORT);
};
