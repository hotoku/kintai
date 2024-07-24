.PHONY: deploy
deploy: server client
	cd plist && make


.PHONY: server
server:
	cd ../server && npm install && npm run build


.PHONY: client
client:
	cd ../client && npm install && npm run build


.PHONY: clean
clean:
	rm -rf ../server/dist ../client/build
	make -C plist clean


.PHONY: clean-all
clean-all:
	rm -rf ../server/node_modules ../client/node_modules
	make clean
