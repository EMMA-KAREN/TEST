/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../Home"; // Adjust the path if needed
import OpenStreetMap from "../../components/OpenStreetMap";


// Mock the OpenStreetMap component
jest.mock("../../components/OpenStreetMap", () => () => <div data-testid="openstreetmap" />);

describe("Home Component", () => {
  test("renders the home page correctly", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check if the welcome message appears
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to iReporter");

    // Check if the paragraph is present
    expect(
      screen.getByText(/Corruption is a huge bane to Africa’s development./i)
    ).toBeInTheDocument();

    // Check if the "Get Started" button is present
    const button = screen.getByRole("button", { name: /Get Started/i });
    expect(button).toBeInTheDocument();

    // Ensure the "Get Started" button links to /signup
    expect(screen.getByRole("link", { name: /Get Started/i })).toHaveAttribute("href", "/signup");

    // Check if the OpenStreetMap component is rendered
    expect(screen.getByTestId("openstreetmap")).toBeInTheDocument();
  });
});
