import { useEffect, useState } from "react";
import { DaySummary, loadWeekSummary, WorkHour } from "./utils";

type WeekPageProps = {
  date: string;
};

function RenderWorkHour({ wh }: { wh: WorkHour }): JSX.Element {
  return <li>{wh.startTime.toISOString()}</li>;
}

function RenderDaySummary({ ds }: { ds: DaySummary }): JSX.Element {
  return (
    <li>
      <li>{ds.date.toISOString()}</li>
      <ul>
        {ds.workHours.map((wh) => (
          <RenderWorkHour wh={wh} />
        ))}
      </ul>
    </li>
  );
}

function WeekPage({ date }: WeekPageProps): JSX.Element {
  console.log("WeekPage");
  const [summaries, setSummaries] = useState<DaySummary[]>([]);
  useEffect(() => {
    loadWeekSummary(date).then(setSummaries);
  });
  return (
    <ul>
      {summaries.map((s) => (
        <RenderDaySummary ds={s} />
      ))}
    </ul>
  );
}

export default WeekPage;
