PROJECT_NAME := kintai
PLIST_NAME := info.hotoku.$(PROJECT_NAME).plist
EXE_NAME := run
PLIST_DESTPATH := $(HOME)/Library/LaunchAgents
LOGCONF_FILE := $(PROJECT_NAME).conf
LOGCONF_DEST := /etc/newsyslog.d/$(LOGCONF_FILE)


.PHONY: all
all: load run $(LOGCONF_DEST)
	@echo making $@


.PHONY: clean
clean: unload
	@echo making $@
	rm -f $(PLIST_NAME) $(LOGCONF_FILE)
	sudo rm -f $(LOGCONF_DEST)


.PHONY: load
load: $(PLIST_NAME) unload permission
	@echo making $@
	cp -f $(PLIST_NAME) $(PLIST_DESTPATH)
	launchctl load $(PLIST_DESTPATH)/$(PLIST_NAME)


.PHONY: unload
unload:
	@echo making $@
	launchctl unload $(PLIST_DESTPATH)/$(PLIST_NAME) || true
	rm -f $(PLIST_DESTPATH)/$(PLIST_NAME)


.PHONY: permission
permission: $(EXE_NAME)
	chmod 755 $(EXE_NAME)


$(PLIST_NAME): $(PLIST_NAME).jinja
	@echo making $@
	jinja2 \
		-D WORKDIR=$(PWD) \
		-D PLIST_NAME=$(subst .plist,,$(PLIST_NAME)) $< > $@


$(LOGCONF_DEST): $(LOGCONF_FILE).jinja
	@echo making $@
	jinja2 \
		-D PWD=$(shell pwd) $< > $(LOGCONF_FILE)
	sudo cp $(LOGCONF_FILE) $@
