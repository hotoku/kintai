PLIST_FILE := info.hotoku.kintai.plist
DEST := $(HOME)/Library/LaunchAgents


load: unload build clear-log $(PLIST_FILE)
	cp $(PLIST_FILE) $(DEST)
	launchctl load $(DEST)/$(PLIST_FILE)


$(PLIST_FILE): $(PLIST_FILE).jinja
	jinja2 $< \
		-D pwd=$(shell pwd) \
		-D KINTAI_SYNC_DATA_PATH=$(KINTAI_SYNC_DATA_PATH) \
		-o $@


clear-log:
	rm log/*


clean: unload
	git clean -fx .


unload:
	launchctl unload $(DEST)/$(PLIST_FILE)


build: build-server build-client


build-server:
	cd server && npm run build


build-client:
	cd ../client && npm run build


start:
	cd server && node dist/index.js


migrate:
	cd server && npm run migrate
