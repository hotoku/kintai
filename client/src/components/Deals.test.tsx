import { unmountComponentAtNode } from "react-dom";
import {
  getAllByRole,
  getAllByText,
  getByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import * as fetches from "../api/fetches";
import { Client, Deal } from "../api/types";

import Deals from "./Deals";
import { DealSeed, makeClient, makeDeal } from "./test-utils";
import { act } from "react-dom/test-utils";

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

test("render deals", async () => {
  const fakeDeals = (
    [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 2],
    ] as DealSeed[]
  ).map(makeDeal);

  const fakeClients = [1, 2].map(makeClient);

  const spy1 = jest.spyOn(fetches, "fetchClients");
  spy1.mockImplementation(
    jest.fn(() => {
      return new Promise((resolve) => resolve(fakeClients));
    }) as jest.Mock
  );

  const spy2 = jest.spyOn(fetches, "fetchDeals");
  spy2.mockImplementation(
    jest.fn(() => {
      return new Promise((resolve) => resolve(fakeDeals));
    }) as jest.Mock
  );

  render(
    <MemoryRouter initialEntries={["/deals?clientId=1"]}>
      <Routes>
        <Route path="/deals" element={<Deals clientId="1" />} />
      </Routes>
    </MemoryRouter>
  );

  // screen.debug();

  /* There is a table, including 4 rows (1 header + 3 record). */
  const table = screen.getByRole("table");
  await waitFor(() => {
    expect(getAllByRole(table, "row").length).toBe(4);
  });

  /* There are 3 cells including client name "client 1" */
  const client1 = getAllByText(table, "client 1");
  expect(client1.length).toBe(3);

  /* There are 3 edit buttons. */
  const editButtons = getAllByRole(table, "button", { name: "edit" });
  expect(editButtons.length).toBe(3);

  /* When click one of edit buttons, it will be replaced with an update and a cancel buttons. */
  userEvent.click(editButtons[0]);
  const editButtons2 = getAllByRole(table, "button", { name: "edit" });
  expect(editButtons2.length).toBe(2);

  const updateButton = getByRole(table, "button", { name: "update" });
  expect(updateButton).not.toBeNull();
  const cancelButton = getByRole(table, "button", { name: "cancel" });
  expect(cancelButton).not.toBeNull();

  /* When click cancel button, it will be replaced with an edit button. */
  userEvent.click(cancelButton);
  const editButtons3 = getAllByRole(table, "button", { name: "edit" });
  expect(editButtons3.length).toBe(3);

  /**
   * There should be a select.
   * When an item having value 2 is selected, navigate to /deals?clientId=2.
   * Right now, I don't know how I can test if the navigation occurs as expected.
   * Maybe, this api document helps..
   * https://reactrouter.com/en/v6.3.0/api
   */
  const select = screen.getByRole("combobox");
  userEvent.selectOptions(select, ["2"]);

  spy1.mockRestore();
  spy2.mockRestore();
});
