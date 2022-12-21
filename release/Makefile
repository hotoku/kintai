PLIST_FILE := info.hotoku.kintai.plist
DEST := $(HOME)/Library/LaunchAgents/$(PLIST_FILE)


.PHONY: load
load: unload build clear-log $(PLIST_FILE)
	cp $(PLIST_FILE) $(DEST)
	launchctl load $(DEST)


$(PLIST_FILE): $(PLIST_FILE).jinja
	jinja2 $< \
		-D pwd=$(shell pwd) \
		-D KINTAI_PORT=$(KINTAI_PORT) \
		-D DATABASE_NAME=$(DATABASE_NAME) \
		-D MYSQL_ROOT_PASSWORD="$(MYSQL_ROOT_PASSWORD)" \
		-D MYSQL_USER_NAME=$(MYSQL_USER_NAME) \
		-D MYSQL_USER_PASSWORD='$(MYSQL_USER_PASSWORD)' \
		-o $@


.PHONY: clean
clean: unload clear-log
	rm -f $(PLIST_FILE) $(DEST) ../server/dist ../client/build


.PHONY: clear-log
clear-log:
	rm -f log/*


.PHONY: unload
unload:
	launchctl unload $(DEST)


.PHONY: build
build: tree-clean build-server build-client


.PHONY: build-server
build-server:
	cd server && npm run build


.PHONY: build-client
build-client:
	cd ../client && npm run build


.PHONY: start
start:
	cd server && node dist/index.js


.PHONY: migrate
migrate: tree-clean
	cd server && npm run migrate-prd


.PHONY: tree-clean
tree-clean:
	@if [ $$(git status -s | wc -l) -ge 1 ]; then echo "Error: local tree is dirty."; false; fi


.PHONY: backup
backup:
	mkdir -p backup
	mysqldump -p"$(MYSQL_ROOT_PASSWORD)" -u root $(DATABASE_NAME) > backup/kintai_prd-$(shell date +"%Y-%m-%d_%H-%M-%S").sql
