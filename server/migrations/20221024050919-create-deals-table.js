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
  db.createTable("Deals", {
    id: { type: "int", primaryKey: true, autoIncrement: true, notNull: true },
    name: { type: "string", notNull: true },
    clientId: {
      type: "int",
      notNull: true,
      foreignKey: {
        name: "Deals_clientId",
        table: "Clients",
        rules: {
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION",
        },
        mapping: "id",
      },
    },
  });
  return null;
};

exports.down = function (db) {
  db.dropTable("Deals");
  return null;
};

exports._meta = {
  version: 1,
};
