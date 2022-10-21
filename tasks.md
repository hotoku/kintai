- [x] dealのcrud
- [ ] サーバーの起動引数/環境変数を登録
- [ ] テストのやり方を学ぶ
- [ ] クライアント側のログの吐き方。開発モードのときだけ吐くみたいな方法があるはず
- [ ] 値のバリデーションなど、例外チェックと例外ハンドリングの戦略を考える
- [ ] dealとclientの間にforeign key制約
- [ ] dealとworkhoursの間にforeign key制約
- [ ] 色を考える。グローバル変数で、名前を付ける
- [ ] tree cleanでなければmake releaseは失敗にする
- [ ] 本番と開発で色を変える
- [ ] work hourの削除機能
- [ ] 外部キー制約のマイングレーション。親子関係があるやつは全部付ける
- [ ] clientの削除機能。モーダルを出して、5桁の確認番号を入れさせる

## workhourの削除機能

- WorkHoursテーブルにdeleted列を追加 or DeletedWorkHoursを作成
- Deleted Work Hoursコンポーネントを作成
- Deleted Work Hoursコンポーネントに削除機能を作成
