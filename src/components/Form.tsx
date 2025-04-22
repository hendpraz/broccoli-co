import React, { useState } from "react";
import { requestInvite } from "../lib/api";

export const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (email !== confirmEmail) {
      newErrors.confirmEmail = "Emails do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const newErrors = validate();

      setApiError("");
      setSuccess(false);
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setLoading(true);

      const result = await requestInvite({ name, email });

      if (result.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setConfirmEmail("");
      } else {
        setApiError(result.errorMessage || "An unexpected error occurred.");
      }
    } catch (err: any) {
      setApiError(err.message || "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="font-mono">
          <p className="text-md italic text-center font-semibold">All done!</p>
          <hr className="w-10 h-0.5 mx-auto bg-gray-700 border-0 mt-4 dark:bg-gray-700" />
          <p className="mt-10 text-sm text-center">
            You will be one of the first to experience Broccoli & Co. when we
            launch.
          </p>

          <button
            onClick={() => {
              onClose();
            }}
            className="w-full border-1 mt-8 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            OK
          </button>
        </div>
      )}
      {!success && (
        <form onSubmit={handleSubmit} className="w-full font-mono">
          <p className="text-md italic text-center">Request an invite!</p>
          <hr className="w-8 h-0.5 mx-auto bg-gray-700 border-0 mt-4 dark:bg-gray-700" />

          <div className="mt-10">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full p-2 border-2 focus:outline-none ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border-2 focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mt-4">
            <input
              type="email"
              placeholder="Confirm email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className={`w-full p-2 border-2 focus:outline-none ${
                errors.confirmEmail
                  ? "border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.confirmEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmEmail}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-1 mt-10 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Sending, please wait..." : "Send"}
          </button>

          {apiError && <p className="mt-4 text-sm text-red-500">{apiError}</p>}
        </form>
      )}
    </div>
  );
};
