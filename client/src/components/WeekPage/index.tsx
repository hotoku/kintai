import { useEffect, useState } from "react";
import { formatTime, formatDate } from "../../share/utils";
import { secToStr } from "../utils";
import { DaySummary, loadWeekSummary, WorkHour } from "./utils";

function duration(wh: WorkHour): number {
  if (!wh.endTime) return 0;
  return (wh.endTime.getTime() - wh.startTime.getTime()) / 1000;
}

type WeekPageProps = {
  date: string;
};

function RenderWorkHour({ wh }: { wh: WorkHour }): JSX.Element {
  return (
    <li>
      {wh.note}■{wh.deal.name.substring(0, 20)}
      <br />
      {formatTime(wh.startTime)} - {wh.endTime ? formatTime(wh.endTime) : ""}
      {wh.endTime ? `(${secToStr(duration(wh))})` : ""}
    </li>
  );
}

function RenderDaySummary({ ds }: { ds: DaySummary }): JSX.Element {
  const totalDuration = secToStr(
    ds.workHours.map((wh) => duration(wh)).reduce((x, y) => x + y, 0)
  );
  return (
    <li>
      {formatDate(ds.date)}: {totalDuration}
      <ul>
        {ds.workHours
          .filter((wh) => !wh.isDeleted)
          .map((wh) => (
            <RenderWorkHour key={wh.id} wh={wh} />
          ))}
      </ul>
    </li>
  );
}

function WeekPage({ date }: WeekPageProps): JSX.Element {
  const [summaries, setSummaries] = useState<DaySummary[]>([]);
  useEffect(() => {
    loadWeekSummary(date).then(setSummaries);
  }, []);
  return (
    <ul>
      {summaries.map((s) => (
        <RenderDaySummary key={s.date.toISOString()} ds={s} />
      ))}
    </ul>
  );
}

export default WeekPage;
