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

## 消去

```shell
cd server/db
make clean
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
