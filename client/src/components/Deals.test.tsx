import { render, screen } from "@testing-library/react";
import Deals from "./Deals";

test("renders learn react link", () => {
  const ret = render(<Deals clientId={1} />);
  const table = ret.container.querySelector("table");
  expect(table).not.toBeNull();
});
