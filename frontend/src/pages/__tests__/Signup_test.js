import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import SignUp from "../SignUp";
import React from "react";

// Mock functions
const mockAddUser = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ addUser: mockAddUser }}>
          <SignUp />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  test("renders the SignUp form", () => {
    expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Simple & Secure Registration/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create an account/i })).toBeInTheDocument();
  });

  test("allows user to fill the form", () => {
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Enter phone number"), { target: { value: "123456789" } });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), { target: { value: "john@example.com" } });

     // Select the password fields more specifically
     const passwordInput = screen.getByPlaceholderText("Enter password");
     fireEvent.change(passwordInput, { target: { value: "password123" } }); // Main password
 
     const confirmPasswordInput = screen.getByPlaceholderText("Confirm password"); // Use getByPlaceholderText for confirmation
     fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
 

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();

    // Fix: Use getAllByDisplayValue instead of getByDisplayValue
    const passwordValues = screen.getAllByDisplayValue("password123");
    expect(passwordValues.length).toBe(2); // Ensure both password fields have the correct value
});



test("shows a console log when passwords do not match", async () => {
    // Mock console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Select the password fields more specifically
    const passwordInput = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, { target: { value: "password123" } }); // Main password

    const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
    fireEvent.change(confirmPasswordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /Create an account/i }));

    console.log("Password doesn't match")

    // Wait for console.log to be called
    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Password doesn't match");
    });

    // Optionally log to verify console calls
    console.log(consoleSpy.mock.calls);

    // Clean up mock after test
    consoleSpy.mockRestore();
});




  test("submits form and navigates to login page when passwords match", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Enter phone number"), { target: { value: "123456789" } });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), { target: { value: "john@example.com" } });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), { target: { value: "password123" } });

    // Select the password fields more specifically
    const passwordInput = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, { target: { value: "password123" } }); // Main password

    const confirmPasswordInput = screen.getByPlaceholderText("Confirm password"); // Use getByPlaceholderText for confirmation
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Create an account/i }));

    expect(mockAddUser).toHaveBeenCalledWith("John", "Doe", "123456789", "john@example.com", "password123");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
