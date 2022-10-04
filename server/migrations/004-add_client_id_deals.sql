--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
alter table Deals
  add clientId integer not null;
--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
ALTER TABLE Deals RENAME TO _Deals_old;

CREATE TABLE Deals (
       id integer primary key,
       name text not null
);

INSERT INTO Deals (id, name)
  SELECT id, name
  FROM _Deals_old;

drop table _Deals_old;
