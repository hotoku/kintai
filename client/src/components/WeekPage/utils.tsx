import dayjs from "dayjs";
import { parseDate2, throwQuery } from "../utils";

// todo: 型の定義が散らばっており、同名で内容が異なるものが共存していたりするので、整理する
// GraphQLのオブジェクトの形に合わせた定義を基本に据えて、利用する場面ごとに不要なプロパティをOmitするのが良いのでは
export type WorkHour = {
  id: number;
  startTime: Date;
  endTime?: Date;
  note: string;
  isDeleted: boolean;
  deal: {
    id: number;
    name: string;
    client: {
      id: number;
      name: string;
    };
  };
};
export type DaySummary = {
  date: Date;
  workHours: WorkHour[];
};

export async function loadWeekSummary(date: string): Promise<DaySummary[]> {
  const query = `
        query {
          object: getWeekSummary(date: "${date}") {
            date
            workHours {
              id
              startTime
              endTime
              note
              isDeleted
              deal {
                id
                name
                client {
                  id
                  name
                }
              }
            }
          }
        }
  `;
  const [objs, errors] = await throwQuery<
    {
      date: string;
      workHours: (Omit<WorkHour, "startTime" | "endTime"> & {
        startTime: string;
        endTime?: string;
      })[];
    }[]
  >(query);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
  return objs.map((obj) => {
    return {
      date: dayjs(obj.date, "YYYY-MM-DD").toDate(),
      workHours: obj.workHours
        .filter((wh) => !wh.isDeleted)
        .map((wh) => {
          return {
            ...wh,
            startTime: parseDate2(wh.startTime),
            endTime: wh.endTime ? parseDate2(wh.endTime) : undefined,
          };
        }),
    };
  });
}
