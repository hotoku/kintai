PLIST_FILE := info.hotoku.kintai.plist
DEST := $(HOME)/Library/LaunchAgents


load: unload build clear-log
	cp $(PLIST_FILE) $(DEST)
	launchctl load $(DEST)/$(PLIST_FILE)


clear-log:
	rm log/*


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
