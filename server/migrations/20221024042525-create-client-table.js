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
  db.createTable("clients", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    name: "string",
  });
  return null;
};

exports.down = function (db) {
  db.dropTable("clients");
  return null;
};

exports._meta = {
  version: 1,
};
