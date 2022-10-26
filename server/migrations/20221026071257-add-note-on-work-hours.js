"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  db.addColumn("WorkHours", "note", {
    type: "string",
    length: 4096,
    notNull: true,
    defaultValue: "",
  });
  return null;
};

exports.down = function (db) {
  db.removeColumn("WorkHours", "note");
  return null;
};

exports._meta = {
  version: 1,
};
