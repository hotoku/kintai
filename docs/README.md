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

## 必要なもの

- DBマイグレーション
