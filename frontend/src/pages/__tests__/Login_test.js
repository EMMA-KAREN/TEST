import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Login from "../Login";
import "@testing-library/jest-dom";

describe("Login Component", () => {
  test("renders the login form", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ login: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Sign in/i, { selector: 'h3' })).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/i, { selector: 'h3' })).toBeInTheDocument();

  });

  test("allows the user to type in email and password fields", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ login: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Enter email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("calls login function when form is submitted", () => {
    const mockLogin = jest.fn();

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ login: mockLogin }}>
          <Login />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Enter email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const submitButton = screen.getByRole("button", {name: /sign in/i});

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });
});
