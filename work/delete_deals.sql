delete from
  Deals
where
  id in (
select tmp.id from (
  select
    dl.id as id
  from
    Deals dl
      left join
    Clients cl
      on dl.clientId = cl.id
  where
    cl.name like '%ダミー%'  
  ) tmp
) 
