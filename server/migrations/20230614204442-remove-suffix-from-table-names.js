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
  db.renameTable("clients2", "clients");
  db.renameTable("deals2", "deals");
  db.renameTable("workhours2", "workhours");
  return null;
};

exports.down = function (db) {
  db.renameTable("workhours", "workhours2");
  db.renameTable("deals", "deals2");
  db.renameTable("clients", "clients2");
  return null;
};

exports._meta = {
  version: 1,
};
