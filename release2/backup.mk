.PHONY: backup
backup:
	mkdir -p backup
	sudo mysqldump -u root $(DATABASE_NAME) > backup/kintai_prd-$(shell date +"%Y-%m-%d_%H-%M-%S").sql
