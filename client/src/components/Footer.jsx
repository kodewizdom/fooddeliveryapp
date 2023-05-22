import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3>About Us</h3>
          <p>At our Food Delivery website, we're on a mission to bring fresh, delicious, and convenient meals right to your doorstep. Our team of expert chefs and delivery drivers are dedicated to providing you with a seamless and satisfying experience, every time.</p>
        </div>
        <div className="footer_section footer_contact">
          <h3>Contact Us</h3>
          <p>Email: foodNova@hotmail.com</p>
          <p>Phone: 0351-457-044</p>
        </div>
        <div className="footer__section">
          <h3>Follow Us</h3>
          <div className="footer__social-icons">
            <a href="#">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faDiscord} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer__copyright">
        <p>&copy; 2023 My Food Delivery App. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;