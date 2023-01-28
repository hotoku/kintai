UPDATE kintai_prd.workhours
SET
  endTime = concat(substring(endTime, 12, 4), "-", CASE substring(endTime, 5, 3)
      WHEN "Jan" THEN "01"
      WHEN "Feb" THEN "02"
      WHEN "Mar" THEN "03"
      WHEN "Apr" THEN "04"
      WHEN "May" THEN "05"
      WHEN "Jun" THEN "06"
      WHEN "Jul" THEN "07"
      WHEN "Aug" THEN "08"
      WHEN "Sep" THEN "09"
      WHEN "Oct" THEN "10"
      WHEN "Nov" THEN "11"
      ELSE "12"
    END, "-", substring(endTime, 9, 2), "T", substring(endTime, 17, 8), substring(endTime, 29, 5))
WHERE
  substring(endTime, 1, 1) != "2";
UPDATE kintai_prd.workhours
SET
  startTime = concat(substring(startTime, 12, 4), "-", CASE substring(startTime, 5, 3)
      WHEN "Jan" THEN "01"
      WHEN "Feb" THEN "02"
      WHEN "Mar" THEN "03"
      WHEN "Apr" THEN "04"
      WHEN "May" THEN "05"
      WHEN "Jun" THEN "06"
      WHEN "Jul" THEN "07"
      WHEN "Aug" THEN "08"
      WHEN "Sep" THEN "09"
      WHEN "Oct" THEN "10"
      WHEN "Nov" THEN "11"
      ELSE "12"
    END, "-", substring(startTime, 9, 2), "T", substring(startTime, 17, 8), substring(startTime, 29, 5))
WHERE
  substring(startTime, 1, 1) != "2";
UPDATE kintai_prd.workhours
SET
  endTime = NULL
WHERE
  endTime = "e-12-DaT";
UPDATE kintai_prd.workhours
SET
  startTime = concat(substring(startTime, 1, 16), ":00", substring(startTime, 17, 5))
WHERE
  length(startTime) != length("2022-10-07T00:40:29+0900");
UPDATE kintai_prd.workhours
SET
  endTime = concat(substring(endTime, 1, 16), ":00", substring(endTime, 17, 5))
WHERE
  length(endTime) != length("2022-10-07T00:40:29+0900");
