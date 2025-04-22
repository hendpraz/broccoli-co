export interface InvitePayload {
  name: string;
  email: string;
}

export async function requestInvite(
  payload: InvitePayload
): Promise<{ success?: boolean; errorMessage?: string }> {
  const res = await fetch(
    "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return { errorMessage: data.errorMessage || "Something went wrong" };
  }

  return { success: true };
}
