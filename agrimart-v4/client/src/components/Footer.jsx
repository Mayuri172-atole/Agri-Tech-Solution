import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      {/* Orange accent bar — matches Navbar brand line */}
      <div className="footer-accent-bar" />

      <div className="footer-inner">

        {/* ── COL 1: Brand Block ── */}
        <div className="footer-col footer-brand-col">
          <div className="footer-logo-block">
            <span className="footer-logo-text">
              Agri<span className="footer-logo-accent">-Tech</span>
              <span className="footer-logo-dot">.</span>
            </span>
            <span className="footer-logo-badge">by SEMENA</span>
          </div>
          <p className="footer-brand-desc">
            India's trusted digital platform for farmers and equipment dealers.
            Quality seeds, tools, and expert advice — delivered to your doorstep.
          </p>
          <div className="footer-social-section">
            <span className="footer-social-label">Follow Us</span>
            <div className="footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 aria-label="Facebook" className="social-icon si-facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 aria-label="Twitter" className="social-icon si-twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 aria-label="Instagram" className="social-icon si-instagram">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                 aria-label="YouTube" className="social-icon si-youtube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* ── COL 2: Quick Links ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/">Shop by Crop</Link></li>
            <li><Link to="/agritube">AgriTube Videos</Link></li>
            <li><Link to="/">Latest News</Link></li>
            <li><Link to="/">Our Services</Link></li>
          </ul>
        </div>

        {/* ── COL 3: Support ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Support</h4>
          <ul className="footer-links">
            <li><Link to="/">Contact Us</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Terms &amp; Conditions</Link></li>
            <li><Link to="/">Returns &amp; Refunds</Link></li>
            <li><Link to="/">FAQ</Link></li>
            <li><Link to="/">Seller Help</Link></li>
          </ul>
        </div>

        {/* ── COL 4: Contact + Newsletter ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Get In Touch</h4>
          <ul className="footer-contact-list">
            <li>
              <span className="contact-icon"><MdLocationOn /></span>
              <span>123 Farm Lane, Nagpur, Maharashtra, India</span>
            </li>
            <li>
              <span className="contact-icon"><MdPhone /></span>
              <span>+91 98765 43210</span>
            </li>
            <li>
              <span className="contact-icon"><MdEmail /></span>
              <a href="mailto:support@agrimart.com">support@agrimart.com</a>
            </li>
          </ul>

          <div className="footer-newsletter">
            <p className="newsletter-label">Get farming tips in your inbox</p>
            <div className="newsletter-row">
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 Agri-Tech-Solution — Powered by SEMENA Hybrid Seeds. All Rights Reserved.
        </p>
        <div className="footer-bottom-links">
          <Link to="/">Privacy</Link>
          <span>·</span>
          <Link to="/">Terms</Link>
          <span>·</span>
          <Link to="/">Sitemap</Link>
        </div>
        <Link to="/admin-login" className="admin-gate">.</Link>
      </div>
    </footer>
  );
};

export default Footer;
