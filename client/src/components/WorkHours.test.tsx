import { unmountComponentAtNode } from "react-dom";
import { getByText, render, screen, waitFor } from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import * as fetches from "../api/fetches";
import { Deal, WorkHour } from "../api/types";
import WorkHours from "./WorkHours";
import { DealSeed, makeDeal, makeWorkHour, WorkHourSeed } from "./test-utils";
import { DefaultSerializer } from "v8";

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
    jest.fn((_: number, _2: boolean | undefined) => {
      return new Promise((resolve) => resolve(fakeWorkHours));
    }) as jest.Mock
  );

  const fakeDeals = ([[1, 1]] as DealSeed[]).map(makeDeal);
  const spy2 = jest.spyOn(fetches, "fetchDeals");
  spy2.mockImplementation(
    jest.fn(() => {
      return new Promise((resolve) => resolve(fakeDeals));
    }) as jest.Mock
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
  screen.findByText("client 1"); // about findBy api, refer to https://bufferings.hatenablog.com/entry/2021/11/18/015809
  screen.findByText("deal 1");

  spy1.mockRestore();
  spy2.mockRestore();
});
