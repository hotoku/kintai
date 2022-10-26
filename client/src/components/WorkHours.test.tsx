import { unmountComponentAtNode } from "react-dom";
import {
  getAllByRole,
  getAllByText,
  getByRole,
  render,
  screen,
} from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import * as fetches from "../api/fetches";
import { Deal, WorkHour } from "../api/types";
import { makeObject } from "./utils";
import WorkHours from "./WorkHours";

let container: HTMLDivElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container === null) return;
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("render work hours", async () => {
  type workHourSeed = [number, number, Date, Date?, boolean?];
  const makeWorkHour = (data: workHourSeed): WorkHour => {
    return makeObject(data, [
      "id",
      "dealId",
      "startTime",
      "endTime",
      "isDeleted",
    ]) as WorkHour;
  };

  const fakeWorkHours = (
    [[1, 1, new Date(), undefined, undefined]] as workHourSeed[]
  ).map(makeWorkHour);

  const spy1 = jest.spyOn(fetches, "fetchWorkHours");
  spy1.mockImplementation(
    jest.fn((cb: (ws: WorkHour[]) => void) => {
      cb(fakeWorkHours);
    }) as jest.Mock
  );

  render(
    <MemoryRouter initialEntries={["/workHours?dealId=1"]}>
      <Routes>
        <Route path="/deals" element={<WorkHours clientId="1" />} />
      </Routes>
    </MemoryRouter>
  );

  spy1.mockRestore();
});
