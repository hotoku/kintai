define domysql
if [ -z "$(MYSQL_ROOT_PASSWORD)" ]; then \
  echo "$1" | sudo mysql -uroot; \
else \
  echo "$1" | mysql -uroot -p"$(MYSQL_ROOT_PASSWORD)"; \
fi
endef


.PHONY: user
user: database
	$(eval QUERY1 := create user if not exists '$(MYSQL_USER_NAME)'@'localhost' identified by '$(MYSQL_USER_PASSWORD)')
	$(eval QUERY2 := grant select, create, insert, delete, drop, alter, references, update on $(DATABASE_NAME).* to '$(MYSQL_USER_NAME)'@'localhost')
	$(call domysql,$(QUERY1))
	$(call domysql,$(QUERY2))


.PHONY: database
database:
	$(eval QUERY := create database if not exists $(DATABASE_NAME))
	$(call domysql,$(QUERY))


.PHONY: clean
clean:
	$(eval QUERY1 := drop database if exists $(DATABASE_NAME))
	$(eval QUERY2 := drop user if exists '$(MYSQL_USER_NAME)'@'localhost')
	$(call domysql,$(QUERY1))
	$(call domysql,$(QUERY2))


.PHONY: restore
restore: dump-file
	@make clean
	@make user
	sudo mysql -uroot $(DATABASE_NAME) < $(DUMP_FILE)


.PHONY: dump-file
dump-file:
	@if [ -z "$(DUMP_FILE)" ]; then echo "DUMP_FILE is empty"; false; fi
