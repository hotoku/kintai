import { unmountComponentAtNode } from "react-dom";
import { getByText, render, screen } from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import * as fetches from "../api/fetches";
import { WorkHour } from "../api/types";
import WorkHours from "./WorkHours";
import { makeWorkHour, WorkHourSeed } from "./test-utils";

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
  const fakeWorkHours = (
    [[1, 1, new Date(), undefined, undefined, "mock"]] as WorkHourSeed[]
  ).map(makeWorkHour);

  const spy1 = jest.spyOn(fetches, "fetchWorkHours");
  spy1.mockImplementation(
    jest.fn(
      (_: number, cb: (ws: WorkHour[]) => void, _2: boolean | undefined) => {
        cb(fakeWorkHours);
      }
    ) as jest.Mock
  );

  render(
    <MemoryRouter initialEntries={["/workHours?dealId=1"]}>
      <Routes>
        <Route path="/workHours" element={<WorkHours dealId="1" />} />
      </Routes>
    </MemoryRouter>
  );

  const table = screen.getByRole("table");
  getByText(table, "note");
  screen.getByText("Client 1");
  screen.getByText("Deal 1");

  spy1.mockRestore();
});
