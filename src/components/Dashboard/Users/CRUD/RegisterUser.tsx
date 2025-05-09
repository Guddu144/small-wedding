"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import { RxCross2 } from "react-icons/rx";
import "./style.css";
export default function RegisterUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: email,
          password,
          role,
          firstName,
          lastName,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        alert("User created!");
        console.log(data);
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setRole("user");
      } else {
        setMessage(data.message || data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Something went wrong while creating the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-xl font-bold bg-gray-200 mr-3 hover:bg-gray-400 rounded-[6px] w-8 h-8 flex items-center justify-center transition">
          +
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay4" />
        <Dialog.Content className="DialogContent4 rounded-2xl shadow-xl">
          <Dialog.Title className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Register a User
          </Dialog.Title>
          <form
            onSubmit={handleCreateUser}
            className="w-full max-w-md mx-auto space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="emmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>

              <input
                id="lastName"
                type="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                User Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="user">User</option>
                <option value="venue_staff">Venue_staff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
          {message && (
            <div className="mt-4 text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded text-center">
              {message}
            </div>
          )}
          <Dialog.Close asChild>
            <button className="IconButton4" aria-label="Close">
              <RxCross2 />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
