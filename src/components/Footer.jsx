import React from 'react';
import * as Icons from 'lucide-react'; // Import everything as an object to avoid export errors
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .league-footer {
          background-color: #1e40af; 
          border-top: 6px solid #facc15;
          padding: 60px 5% 30px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
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
          gap: 15px;
        }

        .footer-brand h2 {
          font-size: 1.8rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: -1px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .footer-accent { color: #facc15; }

        .footer-motto {
          color: #facc15;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .footer-desc {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 400px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .footer-heading {
          font-size: 0.9rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 25px;
          color: #facc15;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-link:hover {
          color: #facc15;
          transform: translateX(5px);
        }

        .footer-socials {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .social-circle {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-circle:hover {
          background: #facc15;
          color: #1e40af;
          transform: translateY(-5px);
          border-color: #facc15;
          box-shadow: 0 5px 15px rgba(250, 204, 21, 0.3);
        }

        .footer-bottom {
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .copyright {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 50px;
          }
          .footer-brand, .footer-section {
            align-items: center;
            text-align: center;
          }
          .footer-brand h2 { justify-content: center; }
          .footer-desc { max-width: 100%; }
          .footer-link { justify-content: center; }
          .footer-socials { justify-content: center; }
          .footer-bottom { flex-direction: column; text-align: center; }
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
              <div className="footer-socials">
                <a href="#" className="social-circle"><Icons.MessageCircle size={20} /></a>
                <a href="#" className="social-circle"><Icons.Music2 size={20} /></a>
                <a href="#" className="social-circle"><Icons.Send size={20} /></a>
                <a href="#" className="social-circle"><Icons.Trophy size={20} /></a>
              </div>
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
                  <Icons.MapPin size={18} className="footer-accent" /> Kampala, Uganda
                </li>
                <li className="footer-link">
                  <Icons.Mail size={18} className="footer-accent" /> info@stjeromeleague.com
                </li>
                <li>
                  <a href="https://stjeromeleague.com" className="footer-link">
                    <Icons.Globe size={18} className="footer-accent" /> Visit Official Site
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright">
              © {currentYear} ST. JEROME LEAGUE • ALL RIGHTS RESERVED
            </div>
            <div className="copyright" style={{ opacity: 0.7 }}>
              Est. 2026
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;