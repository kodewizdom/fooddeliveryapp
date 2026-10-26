import React, { useEffect, useState } from 'react';
import { Header, OrderData } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrder } from '../api';
import { setOrders } from '../context/actions/orderAction';

const UsersOrder = () => {
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [userOrders, setUserOrders] = useState(null);

  useEffect(() => {
    if (!orders) {
      getAllOrder().then((data) => {
        if (data) {
          dispatch(setOrders(data));
          setUserOrders(
            data.filter(
              (item) =>
                item.userId === user?.user_id &&
                item.status !== "pending_payment"
            )
          );
        }
      });
    } else {
      setUserOrders(
        orders.filter(
          (data) =>
            data.userId === user?.user_id &&
            data.status !== "pending_payment"
        )
      );
    }
  }, [orders, user]);

  return (
    <main className="w-full max-w-full min-h-screen flex items-center justify-start flex-col bg-primary overflow-x-hidden">
      <Header />
      <div className="w-full max-w-full flex flex-col items-start justify-center mt-28 md:mt-36 lg:mt-40 px-4 sm:px-8 md:px-16 2xl:px-72 gap-10 md:gap-12 pb-24">
        {userOrders && userOrders.length > 0 ? (
          <>
            {userOrders.map((item, i) => (
              <OrderData key={i} index={i} data={item} admin={false} />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-16 gap-3">
            <h1 className="text-3xl text-headingColor font-bold">No Orders Placed Yet</h1>
            <p className="text-textColor text-base">Your active and past orders will appear here.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default UsersOrder;
