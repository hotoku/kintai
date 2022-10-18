/**
 * DBファイルなど、他のマシンと同期されるデータ置き場のパスを返す。
 * 開発時には、カレントディレクトリを返す。
 */
export const sync_data_path = (): string => {
  return process.env.KINTAI_SYNC_DATA_PATH || process.cwd();
};

/**
 * WEBサーバーの待受ポート
 */
export const port = (): number => {
  if (process.env.KINTAI_PORT) {
    return parseInt(process.env.KINTAI_PORT);
  } else {
    return 8080;
  }
};
