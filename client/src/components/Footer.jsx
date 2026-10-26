import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3>About Us</h3>
          <p>
            At City Food Delivery, we're on a mission to bring fresh, delicious, and convenient meals right to your doorstep. Our team of expert chefs and delivery drivers are dedicated to providing you with a seamless and satisfying experience, every time.
          </p>
        </div>
        <div className="footer__section footer__contact">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:mdskhan4774@gmail.com" className="hover:text-orange-400 transition-colors">mdskhan4774@gmail.com</a></p>
          <p>Phone: <a href="tel:+918210274774" className="hover:text-orange-400 transition-colors">+91 8210274774</a></p>
        </div>
        <div className="footer__section">
          <h3>Follow Us</h3>
          <div className="footer__social-icons">
            <a
              href="https://www.linkedin.com/in/isajidkhan/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedin className="text-xl" />
            </a>
            <a
              href="https://github.com/kodewizdom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <FaGithub className="text-xl" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer__copyright">
        <p>&copy; {currentYear} City Food Delivery. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
