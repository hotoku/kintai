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
  db.addForeignKey(
    "WorkHours",
    "Deals",
    "WorkHours_dealId",
    {
      dealId: "id",
    },
    {
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    }
  );
  return null;
};

exports.down = function (db) {
  db.removeForeignKey("WorkHours", "WorkHours_dealId");
  return null;
};

exports._meta = {
  version: 1,
};
