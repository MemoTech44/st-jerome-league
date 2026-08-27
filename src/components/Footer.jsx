import React from 'react';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .league-footer {
          background-color: #04060d; 
          border-top: 1px solid rgba(250, 204, 21, 0.3);
          padding: 60px 5% 30px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f8fafc;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .footer-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
          align-items: start;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-brand h2 {
          font-family: 'Bebas Neue', cursive;
          font-size: 2.2rem;
          margin: 0;
          letter-spacing: 1.5px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          line-height: 1;
        }

        .footer-accent { color: #facc15; }

        .footer-motto {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .footer-desc {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.7;
          max-width: 400px;
          margin: 4px 0 0 0;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .footer-heading {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.4rem;
          letter-spacing: 1.5px;
          margin: 0 0 20px 0;
          color: #facc15;
          text-transform: uppercase;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-link:hover {
          color: #facc15;
          transform: translateX(4px);
        }

        .footer-socials {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .social-circle {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          transition: all 0.25s ease;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .social-circle:hover {
          background: #1e40af;
          color: #facc15;
          transform: translateY(-3px);
          border-color: rgba(250, 204, 21, 0.4);
          box-shadow: 0 5px 15px rgba(30, 64, 175, 0.4);
        }

        .footer-bottom {
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .copyright {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
          .footer-brand, .footer-section {
            align-items: center;
            text-align: center;
          }
          .footer-brand h2 { justify-content: center; }
          .footer-desc { max-width: 100%; }
          .footer-link { justify-content: center; }
          .footer-socials { justify-content: center; }
          .footer-bottom { flex-direction: column; text-align: center; gap: 10px; }
        }
      `}</style>

      <footer className="league-footer">
        <div className="footer-container">
          <div className="footer-grid">
            
            <div className="footer-brand">
              <h2>
                <span>ST.</span> 
                <span>JEROME</span> 
                <span className="footer-accent">LEAGUE</span>
              </h2>
              <span className="footer-motto">Connecting Generations</span>
              <p className="footer-desc">
                Building a legacy of excellence and faith through the power of sport. 
                Uganda's premier platform for the next generation of champions.
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Quick Navigation</h4>
              <ul className="footer-links">
                <li><Link to="/news" className="footer-link">Latest News</Link></li>
                <li><Link to="/players" className="footer-link">The Players</Link></li>
                <li><Link to="/fixtures" className="footer-link">Match Day Fixtures</Link></li>
                <li><Link to="/table" className="footer-link">League Standings</Link></li>
                <li><Link to="/about" className="footer-link">Our History</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Contact Info</h4>
              <ul className="footer-links">
                <li className="footer-link">
                  <Icons.MapPin size={16} className="footer-accent" /> Kampala, Uganda
                </li>
                <li className="footer-link">
                  <Icons.Mail size={16} className="footer-accent" /> stjeromeleague@gmail.com
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright">
              © {currentYear} St. Jerome League. All rights reserved.
            </div>
            <div className="copyright" style={{ opacity: 0.6 }}>
              Est. 2026
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;