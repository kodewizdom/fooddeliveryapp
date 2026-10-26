import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f04444] text-white px-6 sm:px-10 lg:px-16 py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Main Content Grid: 1 column on mobile, 3 columns on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* About Us */}
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-xl font-bold tracking-tight text-white">About Us</h3>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              At City Food Delivery, we're on a mission to bring fresh, delicious, and convenient meals right to your doorstep. Our team of expert chefs and delivery drivers are dedicated to providing you with a seamless and satisfying experience, every time.
            </p>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-start gap-3 md:pl-4">
            <h3 className="text-xl font-bold tracking-tight text-white">Contact Us</h3>
            <div className="flex flex-col gap-2 text-sm sm:text-base text-white/90">
              <p>
                <span className="font-semibold text-white">Email: </span>
                <a
                  href="mailto:mdskhan4774@gmail.com"
                  className="hover:underline hover:text-white transition-colors"
                >
                  mdskhan4774@gmail.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-white">Phone: </span>
                <a
                  href="tel:+918210274774"
                  className="hover:underline hover:text-white transition-colors"
                >
                  +91 8210274774
                </a>
              </p>
            </div>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-xl font-bold tracking-tight text-white">Follow Us</h3>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/isajidkhan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white hover:text-[#f04444] text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="https://github.com/kodewizdom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white hover:text-[#f04444] text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-xs sm:text-sm text-white/80">
          <p>&copy; {currentYear} City Food Delivery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
