import { render, screen } from "@testing-library/react";
import Deals from "./Deals";

test("renders learn react link", () => {
  render(<Deals clientId={1} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
