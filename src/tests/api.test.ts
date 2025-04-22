import { requestInvite, InvitePayload } from "../lib/api";

global.fetch = jest.fn();

describe("requestInvite", () => {
  const mockPayload: InvitePayload = {
    name: "Hendry Prasetya",
    email: "mhendryp99@example.com",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should return success when the API call is successful", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const result = await requestInvite(mockPayload);

    expect(fetch).toHaveBeenCalledWith(
      "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPayload),
      }
    );
    expect(result).toEqual({ success: true });
  });

  it("Should return an error message when the API call fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errorMessage: "Invalid request" }),
    });

    const result = await requestInvite(mockPayload);

    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual({ errorMessage: "Invalid request" });
  });

  it("Should return a default error message when the API call fails without an errorMessage", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await requestInvite(mockPayload);

    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual({ errorMessage: "Something went wrong" });
  });
});
