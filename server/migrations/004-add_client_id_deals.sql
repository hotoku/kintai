--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
alter table deals
  add clientId integer not null;
--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
ALTER TABLE deals RENAME TO _deals_old;

CREATE TABLE deals (
       id integer primary key,
       name text not null
);

INSERT INTO deals (id, name)
  SELECT id, name
  FROM _deals_old;

drop table _deals_old;
