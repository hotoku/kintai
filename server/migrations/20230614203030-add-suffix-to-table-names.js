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
  db.renameTable("WorkHours", "workhours2");
  db.renameTable("Deals", "deals2");
  db.renameTable("Clients", "clients2");
  return null;
};

exports.down = function (db) {
  db.renameTable("clients2", "Clients");
  db.renameTable("deals2", "Deals");
  db.renameTable("workhours2", "WorkHours");
  return null;
};

exports._meta = {
  version: 1,
};
