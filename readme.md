# kintai

## 構成のメモ

- 環境: 自宅のmac mini
- 本番用と開発用は同じマシンで、作業/動作するディレクトリを分け、環境変数をdirenvでコントロールすることで動作を分ける
  - 開発用フォルダでは、`dev.envrc`を`.envrc`にコピーしておく
  - 本番用フォルダでは、`prd.envrc`を`.envrc`にコピーしておく
- 環境の差異は、以下の環境変数でコントロールする
  - `DATABASE_NAME`
  - `MYSQL_USER_NAME`
  - `MYSQL_USER_PASSWORD`
  - `MYSQL_ROOT_PASSWORD`
  - `KINTAI_PORT`

## 手順

### データのダンプ

データダンプのコマンド

```shell
$ cd ${REPO_DIR}/release
$ make -f backup.mk
```

これで、`${REPO_DIR}/release/backup`の下にダンプファイルができる。ファイル名は、`kintai_prd-2024-07-24_07-04-03.sql`のような形。数字部分は`%Y-%m-%d_%H-%M-%S`。

### データのリストア

```shell
$ cd ${REPO_DIR}/release/db
$ make clean && make
$ DUMP_FILE=ダンプファイルの場所 make
```

開発環境でダンプしたファイルを本番環境のリストア時に指定すれば、データをコピーできる（本番→開発も同様）。
