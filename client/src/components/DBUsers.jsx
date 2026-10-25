// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteAProduct, getAllUser } from "../api";
// import { setAllUserDetails } from "../context/actions/allUsersActions";
// import DataTable from "./DataTable";
// import { Avatar } from "../assets";
// import { alertNULL, alertSuccess } from "../context/actions/alertAction";
// import { getAllProducts, setAllProducts } from "../context/actions/productActions";

// const DBUsers = () => {
//   const allUsers = useSelector((state) => state.allUsers);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!allUsers) {
//       getAllUser().then((data) => {
//         dispatch(setAllUserDetails(data));
//       });
//     }
//   }, []);
//   return (
//     <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
//       <DataTable
//         columns={[
//           {
//             title: "Image",
//             field: "photoURL",
//             render: (rowData) => (
//               <img
//                 src={rowData.photoURL ? rowData.photoURL : Avatar}
//                 className="w-32 h-16 object-contain rounded-md"
//               />
//             ),
//           },
//           {
//             title: "Name",
//             field: "displayName",
//           },
//           {
//             title: "Email",
//             field: "email",
//           },
//           {
//             title: "Verified",
//             field: "emailVerified",
//             render: (rowData) => (
//               <p
//                 className={`px-2 py-1 w-32 text-center text-primary rounded-md ${
//                   rowData.emailVerified ? "bg-emerald-500" : "bg-red-500"
//                 }`}
//               >
//                 {rowData.emailVerified ? "Verified" : "Not Verified"}
//               </p>
//             ),
//           },
//         ]}
//         data={allUsers}
//         title="List of Users"
//         actions={[
//           {
//             icon: "edit",
//             tooltip: "Edit Data",
//             onClick: (event, rowData) => {
//               alert("You want to edit " + rowData.productId);
//             },
//           },
//           {
//             icon: "delete",
//             tooltip: "Delete Data",
//             onClick: (event, rowData) => {
//               if (
//                 window.confirm("Are you sure, you want to perform this action ")
//               ) {
//                 deleteAProduct(rowData.productId).then((res) => {
//                   dispatch(alertSuccess("Product Deleted"));
//                   setInterval(() => {
//                     dispatch(alertNULL());
//                   }, 3000);
//                   getAllProducts().then((data) => {
//                     dispatch(setAllProducts(data));
//                   });
//                 });
//               } else {
//               }
//             },
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default DBUsers;

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
