import { render, screen } from "@testing-library/react";
import Deals from "./Deals";

test("renders table", () => {
  const ret = render(<Deals clientId={1} />);
  const table = ret.container.querySelector("table");
  expect(table).not.toBeNull();
  if (table === null) throw "panic";
  const head = table.getElementsByTagName("thead");
  expect(head.length).toBe(1);
  const body = table.getElementsByTagName("tbody");
  expect(body.length).toBe(1);
  const rows = body[0].getElementsByTagName("tr");
  expect(rows.length).toBe(1);
});
