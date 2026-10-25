import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllUserDetails } from "../context/actions/allUsersActions";
import { getAllUser } from "../api";
import { DataTable } from "../components";
import { Avatar } from "../assets";

const DBUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers) {
      getAllUser().then((data) => {
        if (data) dispatch(setAllUserDetails(data));
      });
    }
  }, [allUsers, dispatch]);

  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "Avatar",
            field: "picture",
            render: (rowData) => (
              <img
                src={rowData?.picture || rowData?.photoURL || Avatar}
                onError={(e) => {
                  e.target.src = Avatar;
                }}
                className="w-12 h-12 object-cover rounded-full shadow-md"
                alt={rowData?.name || "User Avatar"}
              />
            ),
          },
          {
            title: "Name",
            field: "name",
            render: (rowData) => (
              <p className="font-semibold text-textColor">
                {rowData?.name || rowData?.displayName || "User"}
              </p>
            ),
          },
          {
            title: "Email",
            field: "email",
          },
          {
            title: "Role",
            field: "role",
            render: (rowData) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  rowData?.role === "admin"
                    ? "bg-purple-100 text-purple-700 border border-purple-300"
                    : "bg-blue-100 text-blue-700 border border-blue-300"
                }`}
              >
                {rowData?.role || "user"}
              </span>
            ),
          },
          {
            title: "Status",
            field: "email_verified",
            render: (rowData) => {
              const isVerified =
                rowData?.email_verified ?? rowData?.emailVerified ?? true;
              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isVerified
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-amber-100 text-amber-700 border border-amber-300"
                  }`}
                >
                  {isVerified ? "Verified" : "Pending"}
                </span>
              );
            },
          },
        ]}
        data={allUsers}
        title="Registered Users"
      />
    </div>
  );
};

export default DBUsers;
