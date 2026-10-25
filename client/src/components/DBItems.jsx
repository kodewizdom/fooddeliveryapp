// import React from "react";
// import { DataTable } from "../components";
// import { HiCurrencyRupee } from "../assets/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { setAllProducts } from "../context/actions/productActions";
// import { deleteAProduct, getAllProducts } from "../api";
// import { alertNULL, alertSuccess } from "../context/actions/alertAction";

// const DBItems = () => {
//   const products = useSelector((state) => state.products);
//   const dispatch = useDispatch();

//   return (
//     <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
//       <DataTable
//         columns={[
//           {
//             title: "Image",
//             field: "imageURL",
//             render: (rowData) => (
//               <img
//                 src={rowData.imageURL}
//                 className="w-32 h-16 object-contain rounded-md"
//               />
//             ),
//           },
//           {
//             title: "Name",
//             field: "product_name",
//           },
//           {
//             title: "Category",
//             field: "product_category",
//           },
//           {
//             title: "Price",
//             field: "product_price",
//             render: (rowData) => (
//               <p className="text-2xl font-semibold text-textColor flex items-center justify-center">
//                 <HiCurrencyRupee className="text-red-400" />
//                 {parseFloat(rowData.product_price).toFixed(2)}
//               </p>
//             ),
//           },
//         ]}
//         data={products}
//         title="List of Products"
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

// export default DBItems;

import React, { useEffect } from "react";
import { DataTable } from "../components";
import { HiCurrencyRupee } from "../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../context/actions/productActions";
import { deleteAProduct, getAllProducts } from "../api";
import { alertNULL, alertSuccess } from "../context/actions/alertAction";

const DBItems = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        if (data) dispatch(setAllProducts(data));
      });
    }
  }, [products, dispatch]);

  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "Image",
            field: "imageURL",
            render: (rowData) => (
              <img
                src={
                  rowData?.imageURL ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"
                }
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
                }}
                className="w-32 h-16 object-contain rounded-md"
                alt={rowData?.product_name || "Food"}
              />
            ),
          },
          {
            title: "Name",
            field: "product_name",
          },
          {
            title: "Category",
            field: "product_category",
          },
          {
            title: "Price",
            field: "product_price",
            render: (rowData) => (
              <p className="text-2xl font-semibold text-textColor flex items-center justify-center">
                <HiCurrencyRupee className="text-red-400" />
                {parseFloat(rowData?.product_price || 0).toFixed(2)}
              </p>
            ),
          },
        ]}
        data={products}
        title="List of Products"
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Data",
            onClick: (event, rowData) => {
              alert("You want to edit " + rowData?.productId);
            },
          },
          {
            icon: "delete",
            tooltip: "Delete Data",
            onClick: (event, rowData) => {
              if (
                window.confirm("Are you sure you want to delete this product?")
              ) {
                deleteAProduct(rowData?.productId).then((res) => {
                  dispatch(alertSuccess("Product Deleted"));
                  setTimeout(() => {
                    dispatch(alertNULL());
                  }, 3000);
                  getAllProducts().then((data) => {
                    dispatch(setAllProducts(data));
                  });
                });
              }
            },
          },
        ]}
      />
    </div>
  );
};

export default DBItems;
