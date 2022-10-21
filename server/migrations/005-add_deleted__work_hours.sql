--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
alter table WorkHours
  add isDeleted integer default FALSE;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
ALTER TABLE WorkHours RENAME TO _WorkHours_old;

CREATE TABLE WorkHours (
       id integer primary key,
       dealId integer not null,
       startTime text not null,
       endTime text
);

INSERT INTO WorkHours (id, dealId, startTime, endTime)
  SELECT id, dealId, startTime, endTime)
  FROM _WorkHours_old;

drop table _WorkHours_old;
