import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Logo } from "../assets";
import { isActiveStyles, isNoActiveStyles } from "../utils/styles";
import { motion, AnimatePresence } from "framer-motion";
import { buttonClick, slideTop } from "../animations";
import {
  MdShoppingCart,
  MdLogout,
  MdMenu,
  MdClose,
  MdPerson,
  MdReceiptLong,
  MdDashboard,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setUserNull } from "../context/actions/userActions";
import { setCartOn } from "../context/actions/displayCartActions";

const Header = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);

  const [isMenu, setIsMenu] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAdmin =
    user?.role === "admin" ||
    user?.email === "immortalproject01@gmail.com" ||
    user?.email === process.env.REACT_APP_ADMIN_EMAIL ||
    user?.user_id === process.env.REACT_APP_ADMIN_ID;

  const signOut = () => {
    setIsMenu(false);
    setIsMobileNav(false);
    localStorage.removeItem("token");
    localStorage.removeItem("cached_user");
    dispatch(setUserNull());
    navigate("/login", { replace: true });
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="fixed backdrop-blur-md bg-white/85 z-50 inset-x-0 top-0 flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-20 py-3 sm:py-4 border-b border-gray-100/60 shadow-sm transition-all">
      {/* Logo & Brand */}
      <NavLink to="/" className="flex items-center justify-center gap-3">
        <img src={Logo} className="w-10 sm:w-12 object-contain" alt="City Logo" />
        <p className="font-bold text-xl sm:text-2xl text-headingColor tracking-tight">
          City
        </p>
      </NavLink>

      {/* Desktop Navigation Links */}
      <nav className="flex items-center justify-center gap-6 lg:gap-8">
        <ul className="hidden lg:flex items-center justify-center gap-8 lg:gap-14">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNoActiveStyles
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNoActiveStyles
            }
            to="/menu"
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNoActiveStyles
            }
            to="/aboutus"
          >
            About Us
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNoActiveStyles
            }
            to="/contact-us"
          >
            Contact Us
          </NavLink>
        </ul>

        {/* Cart Icon */}
        <motion.div
          {...buttonClick}
          onClick={() => dispatch(setCartOn())}
          className="relative cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          title="View Cart"
        >
          <MdShoppingCart className="text-2xl sm:text-3xl text-textColor" />
          {cart?.length > 0 && (
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-1 -right-1 shadow-sm">
              <p className="text-primary text-xs sm:text-sm font-bold">
                {cart.length}
              </p>
            </div>
          )}
        </motion.div>

        {/* User Profile or Login Button */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setIsMenu(!isMenu)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-md cursor-pointer overflow-hidden border border-orange-200 flex items-center justify-center bg-gray-50 hover:scale-105 transition-transform"
            >
              <img
                className="w-full h-full object-cover"
                src={user?.picture ? user.picture : Avatar}
                alt={user.name || "User"}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.src = Avatar;
                }}
              />
            </div>

            {/* Solid White Opaque Dropdown Menu */}
            <AnimatePresence>
              {isMenu && (
                <motion.div
                  {...slideTop}
                  className="px-4 py-4 w-56 sm:w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 absolute top-14 right-0 flex flex-col gap-2 z-50"
                >
                  <div className="px-3 py-1.5 border-b border-gray-100 pb-2">
                    <p className="text-sm font-bold text-headingColor truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  {isAdmin && (
                    <Link
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-textColor hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      to="/dashboard/home"
                      onClick={() => setIsMenu(false)}
                    >
                      <MdDashboard className="text-lg text-orange-500" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-textColor hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    to="/profile"
                    onClick={() => setIsMenu(false)}
                  >
                    <MdPerson className="text-lg text-gray-500" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-textColor hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    to="/user-orders"
                    onClick={() => setIsMenu(false)}
                  >
                    <MdReceiptLong className="text-lg text-gray-500" />
                    <span>Orders</span>
                  </Link>

                  <hr className="my-1 border-gray-100" />

                  <motion.div
                    {...buttonClick}
                    onClick={signOut}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer transition-colors"
                  >
                    <MdLogout className="text-lg" />
                    <span className="text-sm font-bold">Sign Out</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NavLink to="/login" className="hidden sm:block">
            <motion.button
              {...buttonClick}
              className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl shadow-sm bg-gradient-to-bl from-orange-400 to-orange-600 text-white font-semibold text-sm cursor-pointer hover:shadow-md transition-all"
            >
              Login
            </motion.button>
          </NavLink>
        )}

        {/* Mobile & Tablet Hamburger Toggle Button */}
        <div
          onClick={() => setIsMobileNav(!isMobileNav)}
          className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-2xl text-textColor cursor-pointer hover:bg-gray-200 transition-colors ml-1"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileNav ? <MdClose /> : <MdMenu />}
        </div>
      </nav>

      {/* Mobile & Tablet Navigation Drawer */}
      <AnimatePresence>
        {isMobileNav && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-[60px] sm:top-[70px] inset-x-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-4 z-50"
          >
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/"
                onClick={() => setIsMobileNav(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-semibold text-base transition-colors ${
                    isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-textColor hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/menu"
                onClick={() => setIsMobileNav(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-semibold text-base transition-colors ${
                    isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-textColor hover:bg-gray-50"
                  }`
                }
              >
                Menu
              </NavLink>
              <NavLink
                to="/aboutus"
                onClick={() => setIsMobileNav(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-semibold text-base transition-colors ${
                    isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-textColor hover:bg-gray-50"
                  }`
                }
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact-us"
                onClick={() => setIsMobileNav(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-semibold text-base transition-colors ${
                    isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-textColor hover:bg-gray-50"
                  }`
                }
              >
                Contact Us
              </NavLink>
            </nav>

            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={signOut}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
                >
                  <MdLogout className="text-lg" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileNav(false)}
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-gradient-to-bl from-orange-400 to-orange-600 text-white font-semibold shadow-md text-sm"
                >
                  Sign In / Register
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
