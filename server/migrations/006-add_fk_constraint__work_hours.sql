--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
alter table WorkHours rename to _WorkHours_old;

create table WorkHours (
       id integer primary key,
       dealId integer not null,
       startTime text not null,
       endTime text,
       foreign key(dealId) references Deals(id)
);

insert into WorkHours (id, dealId, startTime, endTime)
  select id, dealId, startTime, endTime from _WorkHours_old;

drop table _WorkHours_old;

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
  SELECT id, dealId, startTime, endTime
  FROM _WorkHours_old;

drop table _WorkHours_old;
