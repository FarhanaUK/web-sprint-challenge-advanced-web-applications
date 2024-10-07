// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react"
import { render, screen } from "@testing-library/react"
import Spinner from "./Spinner"


describe("Spinner Component", () => {
  test("That the spinner component renders on props true", () => {
    render(<Spinner on={true} />);
    expect(screen.queryAllByText(/Please wait.../i)).not.toBeNull();
  });
test('does not render the spinner when "on" is false', () => {
  
render(<Spinner on={false} />)
  expect(screen.queryAllByText(/Please wait.../i)).toHaveLength(0);
})
})

