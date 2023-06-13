DATABASE_NAME := kintai_prd

.PHONY: user
user: database user-info
	@echo "create user if not exists $(MYSQL_USER_NAME)@localhost identified by '$(MYSQL_USER_PASSWORD)'" | \
		sudo mysql
	@echo "grant select, create, insert, delete, drop, alter, references, update on $(DATABASE_NAME).* to $(MYSQL_USER_NAME)@localhost" | \
		sudo mysql

.PHONY: user-info
user-info:
	@if [ -z "$(MYSQL_USER_NAME)" ]; then echo MYSQL_USER_NAME is empty; false; fi
	@if [ -z "$(MYSQL_USER_PASSWORD)" ]; then echo MYSQL_USER_PASSWORD is empty; false; fi



.PHONY: database
database:
	@echo "create database if not exists $(DATABASE_NAME)" | sudo mysql


.PHONY: clean
clean:
	@echo "drop database if exists $(DATABASE_NAME)" | sudo mysql
	@echo "drop user if exists '$(MYSQL_USER_NAME)'@localhost" | sudo mysql


.PHONY: restore
restore: dump-file
	@make clean
	@make user
	@sudo mysql $(DATABASE_NAME) < $(DUMP_FILE)

.PHONY: dump-file
dump-file:
	@if ! [ -f "$(DUMP_FILE)" ]; then echo DUMP_FILE does not exists; false; fi
