import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <ul>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/help-center">Help Center</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <Link to="/media-center">Media Center</Link>
            </li>
            <li>
              <Link to="/investor-relations">Investor Relations</Link>
            </li>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li>
              <Link to="/ways-to-watch">Ways to Watch</Link>
            </li>
            <li>
              <Link to="/terms-of-use">Terms of Use</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/cookie-preferences">Cookie Preferences</Link>
            </li>
            <li>
              <Link to="/corporate-information">Corporate Information</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="footer-social">
          <ul>
            <li>
              <Link to="#">
                <i className="fab fa-facebook-f"></i>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fab fa-instagram"></i>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fab fa-twitter"></i>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fab fa-youtube"></i>
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-info">
          <p>© 2024 Netflix, Inc.</p>
          <p>Netflix Clone created by HoangSon</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
