import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import Cart from "./Cart";
import { Avatar } from "../assets";
import { setUserDetails, setUserNull } from "../context/actions/userActions";
import { alertSuccess, alertDanger, alertNULL } from "../context/actions/alertAction";
import { setCartOn } from "../context/actions/displayCartActions";
import { updateUserProfile, getAllOrder } from "../api";
import {
  MdLock,
  MdShoppingCart,
  MdReceiptLong,
  MdAdminPanelSettings,
  MdLogout,
  MdCheckCircle,
} from "react-icons/md";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const isCart = useSelector((state) => state.isCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [picture, setPicture] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [userOrdersCount, setUserOrdersCount] = useState(0);

  // Initialize form with current user details
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setPicture(user.picture || "");
      if (user.address) {
        setStreet(user.address.street || "");
        setCity(user.address.city || "");
        setStateName(user.address.state || "");
        setPincode(user.address.pincode || "");
      }
    }
  }, [user]);

  // Fetch orders count for user
  useEffect(() => {
    if (user?.user_id) {
      getAllOrder()
        .then((orders) => {
          if (orders && Array.isArray(orders)) {
            const myOrders = orders.filter(
              (o) => o.userId === user.user_id && o.status !== "pending_payment"
            );
            setUserOrdersCount(myOrders.length);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.user_id) return;

    setIsSaving(true);
    const updateData = {
      name,
      phone,
      picture,
      address: {
        street,
        city,
        state: stateName,
        pincode,
      },
    };

    const res = await updateUserProfile(user.user_id, updateData);
    setIsSaving(false);

    if (res?.success) {
      dispatch(setUserDetails(res.data));
      dispatch(alertSuccess("Profile updated successfully!"));
      setTimeout(() => dispatch(alertNULL()), 3000);
    } else {
      dispatch(alertDanger(res?.msg || "Failed to update profile."));
      setTimeout(() => dispatch(alertNULL()), 3000);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    dispatch(setUserNull());
    navigate("/login", { replace: true });
  };

  const memberSinceYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <main className="w-full max-w-full min-h-screen flex items-center justify-start flex-col bg-primary overflow-x-hidden">
      <Header />

      <div className="w-full max-w-full flex flex-col items-start justify-center mt-28 md:mt-36 lg:mt-40 px-4 sm:px-8 md:px-16 2xl:px-72 gap-8 md:gap-10 pb-24">
        {/* Title */}
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-3xl md:text-5xl text-headingColor font-extrabold tracking-wide">
            My Profile
          </h1>
          <div className="w-24 h-1 rounded-md bg-orange-500 mt-1"></div>
          <p className="text-base text-textColor mt-2">
            Manage your personal information, delivery address, and account settings.
          </p>
        </div>

        {!user ? (
          /* Not Logged In State */
          <div className="w-full p-12 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-xl font-bold text-headingColor">
              You are not signed in
            </p>
            <p className="text-sm text-textColor max-w-md">
              Please sign in to view your account details, manage your orders, and save your delivery preferences.
            </p>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-bl from-orange-400 to-orange-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          /* Logged In Profile Content */
          <div className="w-full flex flex-col gap-8">
            {/* Top User Overview Card */}
            <div className="w-full p-6 md:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-orange-200 shadow-md flex-shrink-0 bg-gray-50 flex items-center justify-center">
                  <img
                    src={picture || user.picture || Avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = Avatar;
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-headingColor">
                      {user.name || "User"}
                    </h2>
                    {user.role === "admin" ? (
                      <span className="px-3 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider border border-orange-200">
                        Admin
                      </span>
                    ) : (
                      <span className="px-3 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                        Customer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-textColor text-sm mt-1">
                    <span>{user.email}</span>
                    <MdCheckCircle className="text-emerald-500 text-base" title="Email Verified" />
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    Member since {memberSinceYear}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-semibold transition-colors"
                >
                  <MdLogout className="text-lg" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Orders Stat */}
              <Link
                to="/user-orders"
                className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-orange-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    <MdReceiptLong />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500">My Orders</span>
                    <span className="text-xl font-bold text-headingColor">
                      {userOrdersCount} {userOrdersCount === 1 ? "Order" : "Orders"}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                  View &rarr;
                </span>
              </Link>

              {/* Cart Stat */}
              <div
                onClick={() => dispatch(setCartOn())}
                className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-orange-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    <MdShoppingCart />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500">Active Cart</span>
                    <span className="text-xl font-bold text-headingColor">
                      {cart?.length || 0} {cart?.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                  Open &rarr;
                </span>
              </div>

              {/* Dashboard Access or Role */}
              {user.role === "admin" ? (
                <Link
                  to="/dashboard/home"
                  className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-orange-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      <MdAdminPanelSettings />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500">Administration</span>
                      <span className="text-base font-bold text-headingColor">
                        Admin Dashboard
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                    Enter &rarr;
                  </span>
                </Link>
              ) : (
                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
                      <MdCheckCircle />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500">Account Status</span>
                      <span className="text-base font-bold text-headingColor">
                        Active & Verified
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Editable Profile Form */}
            <form
              onSubmit={handleSaveProfile}
              className="w-full p-8 md:p-10 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-8"
            >
              {/* Form Section Header */}
              <div className="flex flex-col gap-1 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-headingColor">
                  Edit Profile Details
                </h3>
                <p className="text-xs text-textColor">
                  Update your contact details and default delivery address. Email is permanently linked to your account.
                </p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Email Address - READ ONLY */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-600">
                      Email Address
                    </label>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                      <MdLock className="text-xs" /> Immutable Primary ID
                    </span>
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm outline-none cursor-not-allowed select-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">
                    Phone Number (for Delivery)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Profile Picture URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">
                    Profile Picture URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={picture}
                    onChange={(e) => setPicture(e.target.value)}
                    placeholder="https://..."
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-bold text-headingColor">
                    Default Delivery Address
                  </h4>
                  <p className="text-xs text-textColor">
                    Save your address to auto-fill delivery details on future orders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Street */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-600">
                      Street / Flat / Building Address
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Flat 301, Sunshine Heights, MG Road"
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-600">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Panaji"
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-600">State</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Goa"
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-600">PIN Code</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 403001"
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl bg-gradient-to-bl from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold shadow-md active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        <Footer />
        <BackToTop />
      </div>

      {isCart && <Cart />}
    </main>
  );
};

export default Profile;
