.PHONY: all
all:
	make -C ../server/db
	cd ../server && npm run migrate-prd && npm run move


.PHONY: clean
clean:
	make -C ../server/db clean
