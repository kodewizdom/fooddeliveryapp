import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import Cart from "./Cart";
import { useSelector, useDispatch } from "react-redux";
import { FaLinkedin, FaGithub, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { alertSuccess, alertNULL } from "../context/actions/alertAction";

const ContactUs = () => {
  const isCart = useSelector((state) => state.isCart);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phoneNumber, message } = formData;
    const subject = encodeURIComponent(`Food Delivery Inquiry from ${firstName} ${lastName}`);
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phoneNumber}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:mdskhan4774@gmail.com?subject=${subject}&body=${body}`;

    dispatch(alertSuccess("Opening email to send your message to mdskhan4774@gmail.com"));
    setTimeout(() => {
      dispatch(alertNULL());
    }, 4000);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      message: "",
    });
  };

  return (
    <main className="w-full max-w-full min-h-screen flex items-center justify-start flex-col bg-primary overflow-x-hidden">
      <Header />

      <div className="w-full max-w-full flex flex-col items-start justify-center mt-28 md:mt-36 lg:mt-40 px-4 sm:px-8 md:px-16 2xl:px-72 gap-10 md:gap-12 pb-24">
        {/* Title */}
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-3xl md:text-5xl text-headingColor font-extrabold tracking-wide">
            Get in Touch
          </h1>
          <div className="w-24 h-1 rounded-md bg-orange-500 mt-1"></div>
          <p className="text-base text-textColor mt-2 max-w-xl">
            Have questions about an order, restaurant inquiries, or want to give feedback? Reach out directly using the details below or drop us a note.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct contact info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-headingColor">Direct Contacts</h2>
                <p className="text-sm text-textColor mt-1">
                  We usually respond within a few hours.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Phone */}
                <a
                  href="tel:+918210274774"
                  className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-lg bg-orange-500 text-white flex items-center justify-center text-lg shadow-sm">
                    <FaPhoneAlt />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500">Phone</span>
                    <span className="text-base font-bold text-headingColor group-hover:text-orange-600 transition-colors">
                      +91 8210274774
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:mdskhan4774@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-lg bg-orange-500 text-white flex items-center justify-center text-lg shadow-sm">
                    <FaEnvelope />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500">Email</span>
                    <span className="text-base font-bold text-headingColor group-hover:text-orange-600 transition-colors break-all">
                      mdskhan4774@gmail.com
                    </span>
                  </div>
                </a>

                {/* Office */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-11 h-11 rounded-lg bg-gray-700 text-white flex items-center justify-center text-lg flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500">Office</span>
                    <span className="text-sm font-semibold text-headingColor mt-0.5 leading-relaxed">
                      City Food Delivery, Panaji, Goa 403001
                    </span>
                  </div>
                </div>
              </div>

              {/* Developer / Profile Links */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Developer & Socials
                </span>
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.linkedin.com/in/isajidkhan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-[#0077b5] text-white flex items-center justify-center text-xl hover:scale-105 transition-transform"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://github.com/kodewizdom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-[#24292e] text-white flex items-center justify-center text-xl hover:scale-105 transition-transform"
                    title="GitHub"
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 p-8 md:p-10 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-headingColor">Send a Message</h2>
              <p className="text-sm text-textColor mt-1">
                Fill out the form below to send an email inquiry directly to our support team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">First Name</label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">Last Name</label>
                  <input
                    type="text"
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@gmail.com"
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 8210274774"
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">Your Message</label>
                <textarea
                  required
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you need or how we can assist you..."
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-textColor text-sm outline-none focus:border-orange-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-2 py-3 px-6 bg-gradient-to-bl from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.99] text-center"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <Footer />
        <BackToTop />
      </div>

      {isCart && <Cart />}
    </main>
  );
};

export default ContactUs;
