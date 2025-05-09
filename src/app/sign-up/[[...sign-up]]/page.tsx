"use client";

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
const [codeError, setCodeError] = React.useState("");

  const isPasswordValid = (pwd: any) => {
    const lengthCheck = pwd.length >= 8;
    const letterCheck = /[A-Za-z]/.test(pwd);
    const numberCheck = /[0-9]/.test(pwd);
    return lengthCheck && letterCheck && numberCheck;
  };

  console.log(role);
  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailAddress || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters long and include letters and numbers."
      );
      return;
    }

    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      setIsSubmitting(true);
      await signUp.create({
        emailAddress,
        password,
        unsafeMetadata: {
          userRole: `${role}`,
        },
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      const clerkError = err?.errors?.[0];
      if (clerkError?.code === "form_identifier_exists") {
        setError("An account with this email already exists.");
      } else {
        setError(
          clerkError?.message || "Something went wrong. Please try again."
        );
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
            console.error("Verification not complete:", completeSignUp);

        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
 
         setCodeError("The verification code is incorrect. Please try again.");
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  // Display the verification form to capture the OTP code
if (verifying) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Verify Your Email
        </h1>

        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your verification code
          </label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="123456"
            required
          />
        </div>

        {codeError && (
          <div className="text-red-600 text-sm text-center bg-red-100 border border-red-300 px-4 py-2 rounded-md">
            {codeError}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 font-medium rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Verify
        </button>
      </form>
    </div>
  );
}


  // Display the initial sign-up form to capture the email and password
  return (
    <div className="relative">
     <div className="fixed  inset-0 z-50 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm px-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl py-10 px-6 sm:px-8">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up</h1>

    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-100 border border-red-300 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be at least 8 characters and include letters and numbers.
        </p>
      </div>

      {/* CAPTCHA Widget */}
      <div id="clerk-captcha" className="my-4" />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-300 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Next"}
      </button>
    </form>
  </div>
</div>

    </div>
  );
}
