import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg'; 

const Navbar = () => {
  const location = useLocation();

  return (
    <>
      <style>{`
        .league-nav {
          position: fixed;
          top: 0; 
          left: 0; 
          width: 100%;
          z-index: 9999;
          /* The League's Blue Color */
          background: #1e40af; 
          border-bottom: 3px solid #facc15; 
          padding: 10px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .nav-logo-img {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          object-fit: cover;
          border: 2px solid #facc15;
        }

        .league-logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-main { 
          color: white; 
          font-weight: 900; 
          font-size: 1.3rem; 
          letter-spacing: -0.5px; 
          line-height: 1.1;
        }

        .logo-accent { color: #facc15; }

        .logo-sub { 
          color: rgba(255, 255, 255, 0.85); 
          font-size: 0.65rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 1.5px;
        }

        .nav-links { 
          display: flex; 
          gap: 22px; 
          align-items: center; 
        }

        .nav-link { 
          color: white; 
          text-decoration: none; 
          font-size: 0.8rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          position: relative;
          padding: 5px 0;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #facc15;
          transition: 0.3s;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link:hover, .nav-link.active { 
          color: #facc15; 
        }

        .nav-register {
          background: #facc15;
          color: #1e40af !important;
          padding: 8px 18px !important;
          border-radius: 8px;
          font-weight: 900;
          margin-left: 10px;
          border: 2px solid transparent;
        }

        .nav-register:hover {
          background: white;
          border-color: #facc15;
          transform: translateY(-2px);
        }

        .nav-register::after { display: none; }

        @media (max-width: 1150px) {
          .nav-links { gap: 15px; }
          .logo-sub { display: none; }
        }

        @media (max-width: 850px) {
          .nav-link { font-size: 0.7rem; }
          .nav-links { gap: 10px; }
          .nav-logo-img { width: 40px; height: 40px; }
          .logo-main { font-size: 1rem; }
        }
      `}</style>

      <nav className="league-nav">
        <Link to="/" className="brand-container">
          <img src={logo} alt="League Logo" className="nav-logo-img" />
          <div className="league-logo-text">
            <span className="logo-main">ST. JEROME <span className="logo-accent">  LEAGUE</span></span>
            <span className="logo-sub">Connecting Generations</span>
          </div>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/players" className={`nav-link ${location.pathname === '/players' ? 'active' : ''}`}>Players</Link>
          <Link to="/fixtures" className={`nav-link ${location.pathname === '/fixtures' ? 'active' : ''}`}>Fixtures</Link>
          <Link to="/results" className={`nav-link ${location.pathname === '/results' ? 'active' : ''}`}>Results</Link>
          <Link to="/table" className={`nav-link ${location.pathname === '/table' ? 'active' : ''}`}>Table</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          
          <Link 
            to="/register" 
            className={`nav-link nav-register ${location.pathname === '/register' ? 'active' : ''}`}
          >
            Register
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;