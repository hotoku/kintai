.PHONY: user
user: database
	@echo "create user if not exists $(MYSQL_USER_NAME)@localhost identified by '$(MYSQL_USER_PASSWORD)'" | mysql -u root -p"$(MYSQL_ROOT_PASSWORD)"
	@echo "grant select, create, insert, delete, drop, alter, references, update on $(DATABASE_NAME).* to $(MYSQL_USER_NAME)@localhost" | mysql -u root -p"$(MYSQL_ROOT_PASSWORD)"


.PHONY: database
database:
	@echo "create database if not exists $(DATABASE_NAME)" | mysql -u root -p"$(MYSQL_ROOT_PASSWORD)"


.PHONY: clean
clean:
	@echo "drop database if exists $(DATABASE_NAME)" | mysql -u root -p"$(MYSQL_ROOT_PASSWORD)"
	@echo "drop user if exists $(MYSQL_USER_NAME)@localhost" | mysql -u root -p"$(MYSQL_ROOT_PASSWORD)"


.PHONY: restore
restore:
	@echo $()
	$(eval DUMP_FILE := $(shell read -p "back up file ?: " name && echo $$name))
	@make clean
	@make user
	@mysql -u root -p"$(MYSQL_ROOT_PASSWORD)" $(DATABASE_NAME) < ../../release/backup/$(DUMP_FILE)
