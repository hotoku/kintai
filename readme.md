# DBのユーザー

DBは開発用・本番用があるが、サーバーは同一(localhost)。
それぞれの環境はユーザーで区別している。
これらのユーザーに関する設定は`server`,`release`フォルダの`.envrc`ファイルで管理されている。

- 開発用: `kintai_dev`
- 本番用: `kintai_prd`

# 開発用のDB操作

## 作成

``` shell
cd server/db
make
```

## マイグレーション

``` shell
cd server
npm run migrate
# 本番の場合はnpm run migrate-prd
```

## シード

``` shell
cd server
npm run seeds
```

# 本番用のDB操作

## バックアップ

``` shell
mysqldump -p"${MYSQL_ROOT_PASSWORD}" -u root バックアップするDB名 > バックアップ先ファイル名
```

## リストア

``` shell
echo "create database if not exists リストア先のDB名" | mysql -u root -p"${MYSQL_ROOT_PASSWORD}"
cat バックアップファイル名 | mysql -u root -p"${MYSQL_ROOT_PASSWORD}" リストア先のDB名
```

# 本番のリリース作業

`release`フォルダで`make`を実行する。

これによって、`server`, `client`のビルドが走る。
また、ビルドでできたファイルを参照するexpressサーバーを起動するlaunch controleのジョブができる。
