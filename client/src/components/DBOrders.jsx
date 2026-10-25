import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../api";
import { setOrders } from "../context/actions/orderAction";
import { OrderData } from "../components";

const DBOrders = () => {
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!orders) {
      getAllOrder().then((data) => {
        if (data) {
          dispatch(setOrders(data));
        }
      });
    }
  }, []);
  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full gap-4">
      {orders && orders.length > 0 ? (
        <>
          {orders.map((item, i) => (
            <OrderData key={i} index={i} data={item} admin={true} />
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <h1 className="text-3xl text-headingColor font-bold">No Orders Yet</h1>
          <p className="text-textColor text-base">Orders placed by customers will appear here in real time.</p>
        </div>
      )}
    </div>
  );
};

export default DBOrders;
