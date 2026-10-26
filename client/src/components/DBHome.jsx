import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder, getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productActions";
import { setOrders } from "../context/actions/orderAction";
import { CChart } from "@coreui/react-chartjs";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const drinks = products?.filter((item) => item.product_category === "drinks");
  const deserts = products?.filter(
    (item) => item.product_category === "deserts"
  );
  const fruits = products?.filter((item) => item.product_category === "fruits");
  const rice = products?.filter((item) => item.product_category === "rice");
  const curry = products?.filter((item) => item.product_category === "curry");
  const chinese = products?.filter(
    (item) => item.product_category === "chinese"
  );
  const burger = products?.filter((item) => item.product_category === "burger");
  const pizza = products?.filter((item) => item.product_category === "pizza");
  const biryani = products?.filter(
    (item) => item.product_category === "biryani"
  );
  const chicken = products?.filter(
    (item) => item.product_category === "chicken"
  );

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        if (data) dispatch(setAllProducts(data));
      });
    }
    if (!orders) {
      getAllOrder().then((data) => {
        if (data) dispatch(setOrders(data));
      });
    }
  }, [products, orders, dispatch]);

  const confirmedOrders =
    orders?.filter((item) => item.status !== "pending_payment") || [];
  const totalOrders = confirmedOrders.length;
  const preparing =
    confirmedOrders.filter((item) => item.sts === "preparing")?.length || 0;
  const delivered =
    confirmedOrders.filter((item) => item.sts === "delivered")?.length || 0;
  const cancelled =
    confirmedOrders.filter((item) => item.sts === "cancelled")?.length || 0;

  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full h-full">
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="flex items-center justify-center">
          <div className="w-340 md:w-508">
            <CChart
              type="bar"
              data={{
                labels: [
                  "Drinks",
                  "Deserts",
                  "Fruits",
                  "Rice",
                  "Curry",
                  "Chinese",
                  "Burger",
                  "Pizza",
                  "Biryani",
                  "Chicken",
                ],
                datasets: [
                  {
                    label: "Dishes by Category",
                    backgroundColor: "#f87979",
                    data: [
                      drinks?.length || 0,
                      deserts?.length || 0,
                      fruits?.length || 0,
                      rice?.length || 0,
                      curry?.length || 0,
                      chinese?.length || 0,
                      burger?.length || 0,
                      pizza?.length || 0,
                      biryani?.length || 0,
                      chicken?.length || 0,
                    ],
                  },
                ],
              }}
              labels="months"
            />
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-275 md:w-460">
            <CChart
              type="doughnut"
              data={{
                labels: [
                  "Total Orders",
                  "Preparing",
                  "Delivered",
                  "Cancelled",
                ],
                datasets: [
                  {
                    backgroundColor: [
                      "#FF7043",
                      "#FFA726",
                      "#66BB6A",
                      "#EF5350",
                    ],
                    data: [totalOrders, preparing, delivered, cancelled],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;
