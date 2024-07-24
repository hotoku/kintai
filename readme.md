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

### 空のDBを作成する

```shell
$ cd ${REPO_DIR}/release/db
$ make
```

ユーザーが定義されただけのDBが作成される。

### DBを消去する

```shell
$ cd ${REPO_DIR}/release/db
$ make clean
```

対象となるデータベース（環境変数`DATABASE_NAME`の値）が削除される。

### DBのマイグレーション

```shell
$ cd ${REPO_DIR}/server
$ npm run migrate
```

### DBのシード

```shell
$ cd ${REPO_DIR}/server
$ npm run seed
```

### データのダンプ

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

本番環境でダンプしたファイルを開発環境のリストア時に指定すれば、データをコピーできる。

### デプロイ

```shell
$ cd ${REPO_DIR}/release
$ make
```

- serverのビルド
- clientのビルド
- launchdへの登録

が実行される。
