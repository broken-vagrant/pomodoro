import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("renders Clock and all buttons", () => {
  render(<App />);
  expect(screen.getByText(/25\+5 Clock/i)).toBeInTheDocument();
  expect(screen.getByText(/Break Length/i)).toBeInTheDocument();
  expect(screen.getByText(/session Length/i)).toBeInTheDocument();
});

test("checking break/session length change functionality", async () => {
  const { container } = render(<App />);
  expect(container.querySelector("#break-length")).toHaveTextContent("5");
  expect(container.querySelector("#session-length")).toHaveTextContent("25");
  fireEvent.click(container.querySelector("#break-decrement"));
  await waitFor(() =>
    expect(container.querySelector("#break-length")).toHaveTextContent("4")
  );
  fireEvent.click(container.querySelector("#break-increment"));
  await waitFor(() =>
    expect(container.querySelector("#break-length")).toHaveTextContent("5")
  );
  fireEvent.click(container.querySelector("#session-decrement"));
  await waitFor(() =>
    expect(container.querySelector("#session-length")).toHaveTextContent("24")
  );
  fireEvent.click(container.querySelector("#session-increment"));
  await waitFor(() =>
    expect(container.querySelector("#session-length")).toHaveTextContent("25")
  );
});
