import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Deals from "./Deals";

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const makeDeal = (data: [number, string, number]) => {
    return { id: data[0], name: data[1], clientId: data[2] };
  };

  const fakeDeals = (
    [
      [1, "1", 1],
      [2, "2", 1],
      [3, "3", 1],
      [4, "4", 2],
    ] as [number, string, number][]
  ).map(makeDeal);

  const spy = jest.spyOn(global, "fetch");
  spy.mockImplementation(
    jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(fakeDeals) })
    ) as jest.Mock
  );
  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<Deals clientId={1} />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // remove the mock to ensure tests are completely isolated
  spy.mockRestore();
});
