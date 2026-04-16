import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Trophy, 
  Calendar, 
  Play, 
  ChevronRight,
  Zap,
  ArrowRight,
  Shield
} from 'lucide-react';

// Import local assets
import natalImg from '../assets/natal.jpeg';
import bachweziImg from '../assets/bachwezi.jpeg';
import netImg from '../assets/net.jpeg';
import fallImg from '../assets/fall.jpeg';

const Home = () => {
  const [stats, setStats] = useState({ clubs: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clubsSnap = await getDocs(collection(db, "clubs"));
        const newsSnap = await getDocs(collection(db, "news"));
        setStats({ clubs: clubsSnap.size, news: newsSnap.size });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const galleryImages = [natalImg, bachweziImg, netImg, fallImg, natalImg, bachweziImg, netImg, fallImg];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

        .home-page { 
          background-color: #f8fafc; 
          min-height: 100vh; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #0f172a; 
          padding-bottom: 100px;
          overflow-x: hidden;
        }

        /* --- HERO SECTION: GRAY BACKGROUND --- */
        .hero-section {
          position: relative;
          padding: 140px 5% 100px;
          background: #f1f5f9; /* Professional Gray */
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .hero-title {
          font-size: clamp(3rem, 10vw, 5.5rem);
          font-weight: 900;
          line-height: 0.95;
          margin-bottom: 25px;
          letter-spacing: -3px;
          color: #0f172a;
        }

        .highlight-blue { color: #1e40af; }
        .highlight-yellow { color: #facc15; }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 650px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        /* --- MARQUEE: LEAGUE BLUE BACKGROUND --- */
        .marquee-container {
          width: 100%;
          overflow: hidden;
          background: #1e40af; /* League Blue */
          padding: 40px 0;
          white-space: nowrap;
          position: relative;
        }

        .marquee-content {
          display: inline-flex;
          gap: 20px;
          animation: scroll 35s linear infinite;
        }

        .marquee-img {
          width: 380px;
          height: 260px;
          object-fit: cover;
          border-radius: 24px;
          border: 4px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
          transition: 0.3s;
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* --- STATS BAR: POSITIONED UNDER --- */
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
          padding: 60px 5% 0; /* No negative margin, provides breathing room */
        }

        .stat-card {
          background: white;
          padding: 30px 45px;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-top: 5px solid #facc15;
          text-align: center;
          min-width: 220px;
        }

        .stat-card h4 { font-size: 3rem; color: #1e40af; margin: 0; font-weight: 900; }
        .stat-card p { font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-top: 8px; letter-spacing: 1px; }

        /* --- MODULES --- */
        .module-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 80px auto;
          padding: 0 5%;
        }

        .module-card {
          background: white;
          border-radius: 35px;
          padding: 50px 30px;
          border: 1px solid #e2e8f0;
          text-align: center;
          transition: 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center; /* Center content horizontally */
        }

        .module-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.05);
          border-color: #1e40af;
        }

        .icon-box {
          width: 85px;
          height: 85px;
          background: #f1f5f9;
          color: #1e40af;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
        }

        /* --- BUTTONS: CENTERED & SIZED --- */
        .btn-blue {
          background: #1e40af;
          color: white;
          padding: 16px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.2s;
          width: 100%; /* Spans the available width defined by padding */
          max-width: 240px; /* Prevents it from exceeding the box padding */
          margin-top: auto; /* Pushes button to bottom if text varies */
        }

        .btn-blue:hover { background: #1e3a8a; transform: scale(1.02); }

        .btn-yellow {
          background: #facc15;
          color: #0f172a;
          padding: 16px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: 0.2s;
        }

        .btn-yellow:hover { transform: scale(1.02); }

        /* --- FOOTER CTA: LEAGUE BLUE --- */
        .footer-cta {
          background: #1e40af; /* League Blue */
          background: linear-gradient(135deg, #1e40af 0%, #0f172a 100%);
          border-radius: 50px;
          padding: 80px 40px;
          text-align: center;
          color: white;
          margin: 40px 5% 0;
        }

        @media (max-width: 768px) {
          .marquee-img { width: 300px; height: 200px; }
          .hero-section { padding-top: 100px; }
        }
      `}</style>

      <div className="home-page">
        {/* HERO */}
        <header className="hero-section">
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Shield size={20} color="#1e40af" />
            <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', color: '#1e40af' }}>ST. JEROME LEAGUE OFFICIAL WEBSITE</span>
          </div>
          <h1 className="hero-title"><span className="highlight-blue">St. Jerome</span> <span className="highlight-yellow">League</span>
          </h1>
          <p className="hero-subtitle">
            Providing a professional platform for elite talent to shine. Explore standings, catch up on news, and stay connected with the game.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/table" className="btn-blue" style={{ maxWidth: '280px' }}>Championship Standings</Link>
            <Link to="/contact" className="btn-yellow">Join the League</Link>
          </div>
        </header>

        {/* FLOWING PHOTOS: BLUE BACKGROUND */}
        <div className="marquee-container">
          <div className="marquee-content">
            {galleryImages.map((img, index) => (
              <img key={index} src={img} alt="League Action" className="marquee-img" />
            ))}
          </div>
        </div>

        {/* STATS: POSITIONED UNDER */}
        <div className="stats-bar">
          <div className="stat-card">
            <h4>{loading ? '..' : stats.clubs.toString().padStart(2, '0')}</h4>
            <p>Football Clubs</p>
          </div>
          <div className="stat-card">
            <h4>{loading ? '..' : stats.news}</h4>
            <p>Latest Updates</p>
          </div>
          <div className="stat-card">
            <h4>100%</h4>
            <p>Pure Passion</p>
          </div>
        </div>

        {/* MODULES */}
        <main className="module-grid">
          <div className="module-card">
            <div className="icon-box"><Trophy size={36}/></div>
            <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '15px' }}>Championship Table</h3>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1rem', lineHeight: '1.6' }}>
              Real-time rankings and point tallies for all clubs in the current campaign.
            </p>
            <Link to="/table" className="btn-blue">Open Standings</Link>
          </div>

          <div className="module-card">
            <div className="icon-box"><Calendar size={36}/></div>
            <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '15px' }}>Match Fixtures</h3>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1rem', lineHeight: '1.6' }}>
              Check kickoff times, venues, and upcoming matchday schedules.
            </p>
            <Link to="/fixtures" className="btn-blue">View Schedule</Link>
          </div>

          <div className="module-card">
            <div className="icon-box"><Play size={36}/></div>
            <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '15px' }}>News Archive</h3>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1rem', lineHeight: '1.6' }}>
              Catch up on match reports, transfer news, and official announcements.
            </p>
            <Link to="/news" className="btn-blue">Read Stories</Link>
          </div>
        </main>

        {/* FOOTER CTA: BLUE BACKGROUND */}
        <div className="section-container">
          <div className="footer-cta">
            <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '20px' }}>Ready to <span className="highlight-yellow">Join Us?</span></h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px' }}>
              Contact the secretariat to register your club or inquire about sponsorship opportunities.
            </p>
            <Link to="/contact" className="btn-yellow" style={{ padding: '20px 50px', fontSize: '1.1rem' }}>
              Contact Now <ArrowRight size={20} style={{ marginLeft: '10px' }}/>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;