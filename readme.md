# DBのバックアップとリストア

## バックアップ

``` shell
mysqldump -p"${MYSQL_ROOT_PASSWORD}" -u root バックアップするDB名 > バックアップ先ファイル名
```

## リストア

``` shell
echo "create database if not exists リストア先のDB名" | mysql -u root -p"${MYSQL_ROOT_PASSWORD}"
cat バックアップファイル名 | mysql -u root -p"${MYSQL_ROOT_PASSWORD}" リストア先のDB名
```
