- [x] dealのcrud
- [x] サーバーの起動引数/環境変数を登録
- [ ] テストのやり方を学ぶ
- [ ] クライアント側のログの吐き方。開発モードのときだけ吐くみたいな方法があるはず
- [ ] 値のバリデーションなど、例外チェックと例外ハンドリングの戦略を考える
- [ ] 色を考える。グローバル変数で、名前を付ける
- [ ] tree cleanでなければmake releaseは失敗にする
- [ ] 本番と開発で色を変える
- [x] work hourの削除機能
- [x] 外部キー制約のマイングレーション。親子関係があるやつは全部付ける
- [ ] clientの削除機能。モーダルを出して、5桁の確認番号を入れさせる
- [ ] mysqlへの移行

## mysqlへの移行

本番と開発で挙動を変える部分

- db名
- dbのユーザー/パスワード

これらを環境変数として定義する。
その環境変数の値を、どこに書いておくか。

- server/sample.envrcを置いておく。
- release/readmeなどに、リリース時にはserver/sample.envrcから.envrcを作るという手順を書いておく。

落ち穂拾い

- 消すべきものたち
- db, db2
  - db
  - db2
    - dbにrename
    - release2の中のmakefileを編集
- release2
  - releaseにmakefileの名前を変えてコピー
  - readmeにDBの構築手順を残しておく

落ち穂拾い2

- [x] dbをrename
- [x] db2をdbにrename
- [x] release2とreleaseをマージ
- [x] release2から本番DBが作れることを確認
- [x] release2から本番データが移行できることを確認
- [x] 旧dbを削除
- [x] 開発環境のmigrate, seedの動作を確認
- [ ] move関連のソースを削除
- [ ] sqlite, sqlite3のソースを削除
