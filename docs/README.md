# 非機能的な部分について、検討するメモ

## DBについて

- 本番
  - ユーザー: `kintai_prd`
  - DB名: `kintai_prd`
  - 場所: GCE
- 開発
  - ユーザー: `kintai_dev`
  - DB名: `kintai_dev`
  - 場所: 開発用PC

## リリースについて

- 旧: PCでplistで管理
  - releaseフォルダでmake
- 新: GCEで動作させる。フロントにnginxを置く
  - トップでmake
  - そのうちCI/CDを考える

## 環境変数

- DB名
- DBユーザー名
- DBユーザーのパスワード
- サーバーのポート番号

## 必要なもの

- DB
  - マイグレーション
  - バックアップ
  - リストア
- アプリ
  - 開発
    - client
      - npm start
    - server
      - npm start
  - 本番
    - client
      - npm run build
    - server
      - npm run build
      - npm run start-prd
    - nginx

## 移行作業

- kintai-prdを改めて作成
  - こいつは、localにprd.envrcを利用
  - gcpに接続できるようになるため
- gceサーバーで、client/serverをセットアップ
  - 動作確認
- nginxとの連携確認
- https接続の確認
- basic認証の確認
