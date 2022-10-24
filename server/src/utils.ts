/**
 * DBファイルなど、他のマシンと同期されるデータ置き場のパスを返す。
 * 開発時には、カレントディレクトリを返す。
 */
export const sync_data_path = (): string => {
  if (!process.env.KINTAI_SYNC_DATA_PATH) {
    throw "KINTAI_SYNC_DATA_PATH is not defined";
  }
  return process.env.KINTAI_SYNC_DATA_PATH;
};

/**
 * WEBサーバーの待受ポート
 */
export const port = (): number => {
  if (!process.env.KINTAI_PORT) {
    throw "KINTAI_PORT is not defined";
  }
  return parseInt(process.env.KINTAI_PORT);
};
