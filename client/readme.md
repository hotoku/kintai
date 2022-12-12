WorkHoursPage.WorkHourEditorDialogのバグ

## 現象

- halfwayWorkHourに、新しいオブジェクトを渡しているのに、`useState`の`startTime`が古い値のまま
- `useState`の状態が、いつ、刷新されるのかを調べる必要がある
- key引数を渡せば良さそう link: https://zenn.dev/kotaesaki/articles/6249ea64f10574
