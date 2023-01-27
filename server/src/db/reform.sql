SELECT
  startTime,
  concat(substring(startTime, 12, 4), "-", CASE substring(startTime, 5, 3)
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
    END, "-", substring(startTime, 9, 2), "T", substring(startTime, 17, 8), substring(startTime, 29, 5)) AS startTime2
FROM
  kintai_dev.workhours
WHERE
  id = 38;
