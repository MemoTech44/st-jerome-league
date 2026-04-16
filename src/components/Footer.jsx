import React from 'react';
import { Mail, Globe, Trophy, MessageSquare, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .league-footer {
          background-color: #1e40af; /* Official League Blue */
          border-top: 6px solid #facc15; /* Bold Yellow Line on top */
          padding: 80px 5% 40px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
        }

        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 60px;
        }

        .footer-brand h2 {
          font-family: 'Inter', sans-serif;
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -1px;
          margin-bottom: 10px;
          color: white;
        }

        .footer-accent {
          color: #facc15;
        }

        .footer-motto {
          color: #facc15; /* Yellow Motto */
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 20px;
          opacity: 0.9;
        }

        .footer-desc {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.8;
          max-width: 350px;
        }

        .footer-heading {
          font-size: 0.85rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 25px;
          color: #facc15; /* Yellow headings for contrast */
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-link:hover {
          color: #facc15;
          transform: translateX(5px);
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 60px auto 0;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .footer-socials {
          display: flex;
          gap: 15px;
        }

        .social-circle {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: 0.3s;
        }

        .social-circle:hover {
          background: #facc15;
          color: #1e40af;
          transform: translateY(-3px);
        }

        @media (max-width: 850px) {
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
          .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>

      <footer className="league-footer">
        <div className="footer-grid">
          {/* Brand Identity */}
          <div className="footer-brand">
            <h2>ST. JEROME <span className="footer-accent">LEAGUE</span></h2>
            <span className="footer-motto">Connecting Generations</span>
            <p className="footer-desc">
              Building a legacy of excellence and faith through the power of sport. 
              The premier platform for the next generation of champions.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/news" className="footer-link">Latest News</a></li>
              <li><a href="/fixtures" className="footer-link">Upcoming Matches</a></li>
              <li><a href="/table" className="footer-link">League Table</a></li>
              <li><a href="/results" className="footer-link">Past Results</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-links">
              <li className="footer-link">
                <MapPin size={18} color="#facc15" /> Kampala, Uganda
              </li>
              <li className="footer-link">
                <Mail size={18} color="#facc15" /> admin@stjerome.com
              </li>
              <li className="footer-link">
                <Globe size={18} color="#facc15" /> stjeromeleague.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {currentYear} ST. JEROME LEAGUE. ALL RIGHTS RESERVED.
          </div>
          
          <div className="footer-socials">
            <div className="social-circle"><Trophy size={18} /></div>
            <div className="social-circle"><MessageSquare size={18} /></div>
            <div className="social-circle"><Mail size={18} /></div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;