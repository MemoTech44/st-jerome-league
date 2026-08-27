import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowRight, Shield, Heart, Users } from 'lucide-react';

// Assets
import logo from '../assets/logo.jpeg';
import fallImg from '../assets/WhatsApp Image 2026-04-16 at 11.04.17 AM.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsSnap = await getDocs(collection(db, "news"));
        
        const fetchedNews = newsSnap.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            displayDate: data.date || "Latest"
          };
        });

        fetchedNews.sort((a, b) => {
          const timeA = a.date ? new Date(a.date).getTime() : (a.createdAt?.seconds * 1000 || 0);
          const timeB = b.date ? new Date(b.date).getTime() : (b.createdAt?.seconds * 1000 || 0);
          return timeB - timeA;
        });

        setNews(fetchedNews.slice(0, 2));
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="home-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        .home-root { 
          background-color: #060913; 
          color: #f8fafc;
          font-family: 'Plus Jakarta Sans', sans-serif; 
          overflow-x: hidden; 
        }
        
        .hero-viewport { 
          position: relative; 
          background: radial-gradient(circle at top center, rgba(30, 64, 175, 0.4) 0%, #060913 80%);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 100px 24px 50px;
          text-align: center;
        }
        
        .logo-badge { 
          width: 95px; 
          height: 95px; 
          background: #0f172a; 
          border-radius: 50%; 
          padding: 8px; 
          margin: 0 auto 20px; 
          border: 2px solid #facc15; 
          box-shadow: 0 0 30px rgba(250, 204, 21, 0.25); 
          object-fit: contain;
        }
        
        .hero-title {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3rem, 9vw, 5.5rem); 
          letter-spacing: 2px;
          margin: 0 0 4px 0; 
          line-height: 0.95;
          color: #ffffff;
          text-transform: uppercase;
        }

        .hero-subtitle {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-size: clamp(0.85rem, 2vw, 1.1rem);
          margin: 0 auto 30px;
        }

        .gold-heading {
          font-family: 'Bebas Neue', cursive;
          color: #facc15;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin: 0;
          line-height: 1;
        }

        .hero-description-box {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hero-description {
          color: #94a3b8;
          font-size: clamp(0.95rem, 1.8vw, 1.05rem);
          line-height: 1.8;
          font-weight: 400;
          margin: 0;
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
        }

        .value-pillar {
          padding: 32px 24px;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .value-pillar:hover {
          transform: translateY(-4px);
          border-color: rgba(250, 204, 21, 0.4);
        }

        .value-title {
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 14px 0 10px 0;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .pulse-card { 
          transition: all 0.3s ease; 
          border: 1px solid rgba(255, 255, 255, 0.07); 
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 18px;
          cursor: pointer;
        }

        /* Banner with curved corners & padding so it doesn't touch edges */
        .page-banner-wrapper {
          padding: 0 5%;
          max-width: 1280px;
          margin: 10px auto 30px;
          box-sizing: border-box;
        }

        .page-banner {
          width: 100%;
          height: 380px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }

        .page-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .pulse-card:hover { 
          transform: translateY(-4px); 
          border-color: #1e40af; 
          box-shadow: 0 12px 35px rgba(0,0,0,0.6); 
          background: rgba(15, 23, 42, 0.85);
        }

        @media (max-width: 640px) {
          .hero-viewport { padding: 95px 16px 36px; }
          .logo-badge { width: 75px; height: 75px; margin-bottom: 14px; }
          .hero-subtitle { margin-bottom: 20px; }
          
          .page-banner-wrapper {
            padding: 0 16px;
          }

          .page-banner {
            height: 220px;
            border-radius: 16px;
          }

          .pulse-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .pulse-card img {
            width: 100% !important;
            height: 180px !important;
          }
          
          .content-section {
            padding: 36px 16px 60px !important;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero-viewport">
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '850px' }}>
          <img src={logo || ""} alt="League Logo" className="logo-badge" />
          <h1 className="hero-title">St. Jerome League</h1>
          <p className="hero-subtitle">Connecting Generations</p>
          
          <div className="hero-description-box">
            <p className="hero-description">
              The St. Jerome League stands as a premier football championship built on the timeless values of sportsmanship, excellence, and camaraderie. Founded to celebrate football heritage, our league brings together teams from diverse backgrounds to compete at the highest structural standard while fostering athletic development.
            </p>
            <p className="hero-description">
              Through dynamic match seasons and community-driven initiatives, we create an ecosystem where historic rivalries thrive alongside genuine fellowship. We empower players, honor our supporters, and maintain an inclusive football environment that truly connects generations across the pitch.
            </p>
          </div>
        </div>
      </section>

      {/* CURVED BANNER IMAGE WRAPPER */}
      <div className="page-banner-wrapper">
        <div className="page-banner">
          <img 
            src={fallImg} 
            alt="St. Jerome League Match Action" 
          />
        </div>
      </div>

      {/* CENTERED LEAGUE VALUES */}
      <section style={{ padding: '30px 5% 50px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="gold-heading">Core Pillars</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="value-pillar">
            <Shield color="#facc15" size={32} />
            <h4 className="value-title">Heritage & Integrity</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7 }}>
              Upholding strict standards of fair play and respecting the rich football tradition that brings our clubs together season after season.
            </p>
          </div>

          <div className="value-pillar">
            <Users color="#facc15" size={32} />
            <h4 className="value-title">Community Unity</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7 }}>
              Serving as a vital bridge that connects emerging young talent with seasoned veterans, forging unbreakable bonds beyond the 90 minutes.
            </p>
          </div>

          <div className="value-pillar">
            <Heart color="#facc15" size={32} />
            <h4 className="value-title">Unmatched Passion</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7 }}>
              Providing an intense, high-energy league structure where every match day brings out the absolute best in our players and dedicated supporters.
            </p>
          </div>
        </div>
      </section>

      {/* LATEST NEWS SECTION */}
      <section className="content-section" style={{ padding: '40px 5% 80px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase' }}>Stay Updated</span>
            <h2 className="gold-heading" style={{ marginTop: '4px' }}>Latest News</h2>
          </div>
          <Link to="/news" style={{ color: '#facc15', fontWeight: 800, textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View All News <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
            Loading latest news...
          </div>
        ) : news.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
            No news articles published yet.
          </div>
        ) : (
          <div className="news-grid">
            {news.map(item => (
              <div key={item.id} onClick={() => navigate('/news')} className="pulse-card">
                <img src={item.image || item.imageUrl || fallImg} style={{ width: '95px', height: '95px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} alt={item.title || "News Image"} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.displayDate}</span>
                  <h4 style={{ margin: '6px 0', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.35, textTransform: 'capitalize' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.45 }}>
                    {item.excerpt || (item.content ? item.content.substring(0, 70) + '...' : '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;