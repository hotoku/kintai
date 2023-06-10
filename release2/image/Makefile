.PHONY: image
image: commit-hash
	$(eval YMD := $(shell date "+%y%m%d%H%M%S"))
	packer init .
	packer build \
		--var image-suffix=$(YMD)-$(COMMIT_HASH) \
		--var project-id=$(PROJECT_ID) \
		--var instance-size=60 \
		--var label-value=zkyiqdnhso9mvs1taibgmys9spfrqe \
		.


.PHONY: commit-hash
commit-hash: tree-clean
	$(eval COMMIT_HASH := $(shell git rev-parse HEAD | cut -c1-7))


.PHONY: tree-clean
tree-clean:
	@if [[ $$(git st -s | wc -l) -ge 1 ]]; then echo "Error: local tree is dirty."; false; fi
