import { Dayjs } from "dayjs";

type WeekPageProps = {
  week: Dayjs;
};
function WeekPage({ week }: WeekPageProps): JSX.Element {
  console.log(week);
  return <div></div>;
}

export default WeekPage;
