delete from
  WorkHours
where
  id in (
select tmp.id from (
  select
    wh.id as id
  from
    WorkHours wh
      left join
    Deals dl
      on wh.dealId = dl.id
      left join
    Clients cl
      on dl.clientId = cl.id
  where
    cl.name like '%ダミー%'  
  ) tmp
) 
