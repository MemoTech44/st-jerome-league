import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowRight, Shield, Heart, Users } from 'lucide-react';

// Assets
import fallImg from '../assets/chris.jpeg';

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
          background-color: #04060d; 
          color: #f8fafc;
          font-family: 'Plus Jakarta Sans', sans-serif; 
          overflow-x: hidden; 
        }
        
        .hero-viewport { 
          position: relative; 
          background: radial-gradient(circle at top center, rgba(15, 23, 42, 0.9) 0%, #04060d 80%);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 120px 24px 50px;
          text-align: center;
        }

        .welcome-prefix {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-weight: 700;
          letter-spacing: 5px;
          text-transform: uppercase;
          font-size: clamp(0.9rem, 2.2vw, 1.25rem);
          margin: 0 0 8px 0;
        }
        
        .hero-title {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3.2rem, 9.5vw, 5.8rem); 
          letter-spacing: 2px;
          margin: 0 0 16px 0; 
          line-height: 0.95;
          color: #ffffff;
          text-transform: uppercase;
        }

        .hero-subtitle {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: clamp(0.85rem, 1.8vw, 1.05rem);
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
          max-width: 860px;
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
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
        }

        .value-pillar {
          padding: 32px 24px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          border: 1px solid rgba(255, 255, 255, 0.08); 
          background: rgba(15, 23, 42, 0.9);
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 18px;
          cursor: pointer;
        }

        .page-banner-wrapper {
          padding: 0 5%;
          max-width: 1280px;
          margin: 10px auto 30px;
          box-sizing: border-box;
        }

        .page-banner {
          width: 100%;
          height: 380px;
          border-radius: 18px;
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
          border-color: rgba(250, 204, 21, 0.3); 
          box-shadow: 0 12px 35px rgba(0,0,0,0.6); 
          background: rgba(15, 23, 42, 1);
        }

        @media (max-width: 640px) {
          .hero-viewport { padding: 95px 16px 36px; }
          
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
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '860px' }}>
          <p className="welcome-prefix">Welcome To</p>
          <h1 className="hero-title">St. Jerome League</h1>
          <p className="hero-subtitle">Connecting Generations</p>
          
          <div className="hero-description-box">
            <p className="hero-description">
              The St. Jerome League is more than a football championship—it is a celebration of heritage, friendship, achievement, and the enduring bonds forged within the walls of our schools. Bringing together alumni from different generations, classes, and eras, the League transforms the beautiful game into a powerful platform for reconnection, healthy rivalry, and lifelong camaraderie.
            </p>
            <p className="hero-description">
              Operating proudly under the mother body of the Jerome Students Association (JOSA), the St. Jerome League provides a professionally structured football environment where alumni can compete at the highest standard while strengthening the relationships that continue long after graduation. Here, former classmates return not merely as spectators, but as players, leaders, mentors, and ambassadors of their school legacy.
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
              Upholding strict standards of fair play and respecting the rich traditions of St. Jerome Secondary School Ndama across every season.
            </p>
          </div>

          <div className="value-pillar">
            <Users color="#facc15" size={32} />
            <h4 className="value-title">Alumni Unity</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7 }}>
              Acting as a vibrant networking bridge connecting veteran alumni with recent graduates through JOSA initiatives and football camaraderie.
            </p>
          </div>

          <div className="value-pillar">
            <Heart color="#facc15" size={32} />
            <h4 className="value-title">Unmatched Passion</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7 }}>
              Delivering an intense, high-energy league structure where every match day brings out the absolute best in our players and supporters.
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