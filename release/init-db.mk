.PHONY: all
all:
	make -C ../server/db
	cd ../server && npm run migrate-prd


.PHONY: clean
clean:
	make -C ../server/db clean
