"use client";
import React, { useEffect, useState } from "react";
import UsersTable from "./UsersTable/UsersTable";
import UsersDropdownMenu from "./Dropdown/UsersDropdownMenu";
import SearchUser from "./SearchUser/SearchUser";
import RegisterUser from "./CRUD/RegisterUser";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  unsafeMetadata: {
    role: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Props {
  userRole: string;
}

const UserManagement: React.FC<Props> = ({ userRole }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getuser`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setUsers(data.users);
      console.log("Users List", data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <div className="flex justify-between gap-4">
        <UsersDropdownMenu />
        <SearchUser />
      </div>

      <UsersTable userRole={userRole} data={users} />
    </div>
  );
};

export default UserManagement;
