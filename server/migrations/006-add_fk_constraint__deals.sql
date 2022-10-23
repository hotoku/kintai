--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
alter table Deals rename to _Deals_old;


CREATE TABLE Deals
(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  clientId integer not null,
  foreign key(clientId) references Clients(id)
);

insert into Deals (id, name, clientId)
  select id, name, clientId from _Deals_old;

drop table _Deals_old;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
ALTER TABLE Deals RENAME TO _Deals_old;

CREATE TABLE Deals
(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  clientId integer not null
)

INSERT INTO Deals (id, name, clientId)
  SELECT id, name, clientId
  FROM _Deals_old;

drop table _Deals_old;
