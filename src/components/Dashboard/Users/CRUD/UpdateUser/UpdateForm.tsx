"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PropsSlug {
  slug: string;
}

const UpdateUserForm: React.FC<PropsSlug> = ({ slug }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "", // Optional field
    unsafeMetadata: {
      role: "", // Make sure role is handled correctly
    },
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getSingleData = async () => {
      try {
        const res = await fetch(`/api/getoneuser?user_id=${slug}`);
        const data = await res.json();
        const user = data?.user;

        if (user) {
          setFormData({
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            password: "",
            unsafeMetadata: {
              role: user.unsafeMetadata?.role || "",
            },
          });
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    if (slug) getSingleData();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === "role") {
      setFormData((prev) => ({
        ...prev,
        unsafeMetadata: { ...prev.unsafeMetadata, role: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation: Check if role is selected
    if (!formData.unsafeMetadata.role) {
      alert("Please select a role.");
      setLoading(false);
      return;
    }

    // Construct the payload conditionally
    const payload: any = { ...formData };

    // Only include the password if it's not empty
    if (!payload.password) {
      delete payload.password;  // This will be omitted from the request
    }

    try {
      const res = await fetch(`/api/updateuser?user_id=${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("User updated successfully!");
        router.push("/dashboard");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="DialogContent2">
      <h1 className="text-center text-2xl py-10 font-semibold">Update User</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
        <input
          id="email"
          type="email"
          disabled
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full rounded border p-2 bg-[#bebebe6c]"
        />

        <input
          id="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="w-full rounded border p-2"
        />

        <input
          id="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="w-full rounded border p-2"
        />

        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password (optional)"
          className="w-full rounded border p-2"
        />

        <select
          id="role"
          value={formData.unsafeMetadata.role}
          onChange={handleChange}
          className="w-full rounded border p-2"
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="venue_staff">Venue Staff</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUserForm;
