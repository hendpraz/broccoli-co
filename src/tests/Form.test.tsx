import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "../components/Form";
import { requestInvite } from "../lib/api";

jest.mock("../lib/api");

describe("Form Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should renders the form correctly", () => {
    render(<Form onClose={() => {}} />);
    expect(screen.getByPlaceholderText("Full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm email")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("Should show validation errors when fields are empty", async () => {
    render(<Form onClose={() => {}} />);
    fireEvent.click(screen.getByText("Send"));

    expect(
      await screen.findByText("Full name is required.")
    ).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
  });

  it("Should show validation error when emails do not match", async () => {
    render(<Form onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "hend@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm email"), {
      target: { value: "hend12345@example.com" },
    });
    fireEvent.click(screen.getByText("Send"));

    expect(await screen.findByText("Emails do not match.")).toBeInTheDocument();
  });

  it("Should submit the form successfully", async () => {
    (requestInvite as jest.Mock).mockResolvedValue({ success: true });

    render(<Form onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("Full name"), {
      target: { value: "Hendry Prasetya" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "mhendryp99@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm email"), {
      target: { value: "mhendryp99@example.com" },
    });
    fireEvent.click(screen.getByText("Send"));

    expect(screen.getByText("Sending, please wait...")).toBeInTheDocument();
    await waitFor(() =>
      expect(requestInvite).toHaveBeenCalledWith({
        name: "Hendry Prasetya",
        email: "mhendryp99@example.com",
      })
    );
    expect(await screen.findByText("All done!")).toBeInTheDocument();
  });

  it("Should show API error message on error", async () => {
    (requestInvite as jest.Mock).mockResolvedValue({
      success: false,
      errorMessage: "Something went wrong.",
    });

    render(<Form onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("Full name"), {
      target: { value: "Hendry Prasetya" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "mhendryp@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm email"), {
      target: { value: "mhendryp@example.com" },
    });
    fireEvent.click(screen.getByText("Send"));

    expect(screen.getByText("Sending, please wait...")).toBeInTheDocument();
    await waitFor(() => expect(requestInvite).toHaveBeenCalled());
    expect(
      await screen.findByText("Something went wrong.")
    ).toBeInTheDocument();
  });
});
