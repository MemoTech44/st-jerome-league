import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { 
  ArrowRight, ChevronRight, ChevronLeft, Calendar, Layout
} from 'lucide-react';

// Assets
import natalImg from '../assets/natal.jpeg';
import bachweziImg from '../assets/bachwezi.jpeg';
import netImg from '../assets/net.jpeg';
import fallImg from '../assets/fall.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [currentHero, setCurrentHero] = useState(0);
  const [currentNews, setCurrentNews] = useState(0);
  const [data, setData] = useState({ news: [], results: [], standings: [] });

  const heroSlides = [
    { img: natalImg, title: "ST. JEROME LEAGUE", sub: "EXCELLENCE • COMMUNITY • PASSION" },
    { img: bachweziImg, title: "THE ARENA OF LEGENDS", sub: "WHERE HISTORY IS WRITTEN" },
    { img: netImg, title: "FOOTBALL REDEFINED", sub: "SEASON ONE IS LIVE" }
  ];

  const sponsors = [
    { name: "Partner One", logo: "https://via.placeholder.com/150/1e40af/FFFFFF?text=PARTNER+1" },
    { name: "Partner Two", logo: "https://via.placeholder.com/150/1e40af/FFFFFF?text=PARTNER+2" },
    { name: "Partner Three", logo: "https://via.placeholder.com/150/1e40af/FFFFFF?text=PARTNER+3" },
    { name: "Partner Four", logo: "https://via.placeholder.com/150/1e40af/FFFFFF?text=PARTNER+4" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsSnap = await getDocs(query(collection(db, "news"), orderBy("date", "desc"), limit(6)));
        const fetchedNews = newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setData(prev => ({
          ...prev,
          news: fetchedNews.length > 0 ? fetchedNews : [
            { id: '1', title: "Bachwezi Dominate Season Opener", date: "April 2026", image: netImg, excerpt: "The legendary Bachwezi team showed why they are favorites this season..." },
            { id: '2', title: "New Kits Unveiled for Natal FC", date: "April 2026", image: natalImg, excerpt: "Natal FC has officially released their home and away kits for the alumni league..." },
            { id: '3', title: "Ndama Grounds Expansion", date: "March 2026", image: fallImg, excerpt: "Major upgrades are coming to the St. Jerome sports arena to facilitate more games..." }
          ],
          results: [
            { home: "BACHWEZI", away: "NATAL", score: "2 - 1" },
            { home: "NCHERE", away: "MABIRA", score: "0 - 0" },
          ],
          standings: [
            { pos: 1, name: "BACHWEZI", p: 4, pts: 10 },
            { pos: 2, name: "BASHI", p: 4, pts: 9 },
            { pos: 3, name: "EKINYASI", p: 4, pts: 7 },
          ]
        }));
      } catch (err) { console.error("Firestore Error:", err); }
    };
    fetchData();

    // 7s Hero Timer
    const heroInt = setInterval(() => setCurrentHero(p => (p + 1) % heroSlides.length), 7000);
    // 10s News Auto-Scroll Timer
    const newsInt = setInterval(() => setCurrentNews(p => (p + 1) % (data.news.length || 3)), 10000);

    return () => { clearInterval(heroInt); clearInterval(newsInt); };
  }, [data.news.length]);

  return (
    <div className="home-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        
        .home-root { background-color: #f8fafc; color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

        /* HERO */
        .hero-viewport {
          height: 90vh; position: relative; display: flex; align-items: center; justify-content: center;
          background: #000; overflow: hidden; text-align: center;
        }
        .hero-bg {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          transition: transform 1.5s ease, opacity 1s ease; opacity: 0; filter: brightness(0.4);
        }
        .hero-bg.active { opacity: 1; transform: scale(1.05); }
        .hero-content { position: relative; z-index: 10; color: white; padding: 0 20px; max-width: 1100px; }
        .hero-content h1 { font-size: clamp(3rem, 10vw, 6rem); font-weight: 900; line-height: 1; margin: 20px 0; text-transform: uppercase; }

        /* WELCOME BOX */
        .welcome-box { 
          border: 2px solid #e2e8f0; border-radius: 24px; padding: 60px; 
          margin: 80px 8%; text-align: center; background: #ffffff;
          transition: 0.3s;
        }
        .welcome-box:hover { border-color: #1e40af; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }

        /* NEWS CAROUSEL */
        .news-section { padding: 80px 8%; background: #ffffff; }
        .carousel-wrapper { position: relative; width: 100%; height: 450px; overflow: hidden; border-radius: 24px; }
        .news-slide {
          position: absolute; width: 100%; height: 100%; transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; cursor: pointer; background: #fff; border: 1px solid #eee; border-radius: 24px; overflow: hidden;
        }

        /* BUTTONS */
        .btn-gold { 
          background: #facc15; color: #1e40af; padding: 18px 35px; border-radius: 12px; 
          font-weight: 800; text-transform: uppercase; transition: 0.3s; text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
        }
        .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(250, 204, 21, 0.3); }

        @media (max-width: 900px) {
          .news-slide { flex-direction: column; }
          .carousel-wrapper { height: 600px; }
          .welcome-box { padding: 30px; margin: 40px 5%; }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero-viewport">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-bg ${i === currentHero ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.img})` }} />
        ))}
        <div className="hero-content">
          <span style={{ color: '#facc15', fontWeight: 800, letterSpacing: '5px' }}>{heroSlides[currentHero].sub}</span>
          <h1>{heroSlides[currentHero].title}</h1>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
            <Link to="/news" className="btn-gold">The Pulse <ChevronRight size={20}/></Link>
            <Link to="/contact" style={{ border: '2px solid white', color: 'white', padding: '16px 35px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>Join League</Link>
          </div>
        </div>
      </section>

      {/* WELCOME SECTION IN BORDERED BOX */}
      <section className="welcome-box">
        <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1e40af', marginBottom: '24px', letterSpacing: '-1px' }}>Welcome to the St. Jerome League</h2>
        <p style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.25rem', color: '#64748b', lineHeight: '1.8' }}>
          Welcome to the official digital home of the St. Jerome League. This is a premier alumni football league 
          dedicated to the former students of <strong>St. Jerome Secondary School Ndama</strong>. We play to stay connected, 
          stay fit, and keep the spirit of Ndama alive.
        </p>
      </section>

      {/* AUTO-SLIDING NEWS CAROUSEL (10 SECONDS) */}
      <section className="news-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>League Pulse</h2>
            <p style={{ color: '#64748b', margin: '5px 0 0' }}>Latest stories from the Ndama alumni community</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setCurrentNews(p => (p - 1 + (data.news.length || 3)) % (data.news.length || 3))} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}><ChevronLeft/></button>
            <button onClick={() => setCurrentNews(p => (p + 1) % (data.news.length || 3))} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}><ChevronRight/></button>
          </div>
        </div>

        <div className="carousel-wrapper">
          {(data.news.length > 0 ? data.news : [1, 2, 3]).map((item, i) => (
            <div 
              key={item.id || i} 
              className="news-slide"
              onClick={() => navigate(`/news/${item.id}`)}
              style={{ 
                transform: `translateX(${(i - currentNews) * 100}%)`,
                opacity: i === currentNews ? 1 : 0,
                pointerEvents: i === currentNews ? 'auto' : 'none'
              }}
            >
              <div style={{ flex: 1.2, height: '100%' }}>
                <img src={item.image || netImg} alt="news" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e40af', fontWeight: 700, marginBottom: '15px' }}>
                  <Calendar size={18}/> {item.date || "APRIL 2026"}
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2 }}>{item.title || "Matchday Highlights"}</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '30px' }}>{item.excerpt || "Discover the latest results and standout performances from our alumni teams..."}</p>
                <span style={{ fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  READ FULL STORY <ArrowRight size={20}/>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section style={{ padding: '100px 8%', background: '#f1f5f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src={fallImg} alt="About" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
            <div style={{ position: 'absolute', bottom: '-20px', right: '20px', background: '#1e40af', color: 'white', padding: '20px 30px', borderRadius: '15px', fontWeight: 800 }}>
              EST. 2024
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e40af', marginBottom: '25px' }}>The Legend of St. Jerome League</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
              The St. Jerome League was founded as a platform to reunite the brothers who passed through the gates of 
              St. Jerome Secondary School Ndama. It is more than just football; it is a networking hub and a community 
              support system for alumni across various professions.
            </p>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '35px' }}>
              Our league features foundation teams like the mighty Bachwezi, Natal, and Bashi, competing every season 
              to claim the ultimate bragging rights while giving back to our alma mater.
            </p>
            <Link to="/about" className="btn-gold" style={{ background: '#1e40af', color: 'white' }}>League History</Link>
          </div>
        </div>
      </section>

      {/* MATCH CENTRE */}
      <section style={{ padding: '100px 8%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}><Layout color="#1e40af"/> Latest Results</h3>
            {data.results.map((r, i) => (
              <div key={i} className="match-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', border: '1px solid #e2e8f0', marginBottom: '15px', textAlign: 'center' }}>
                <span style={{ fontWeight: 700 }}>{r.home}</span>
                <div style={{ background: '#f1f5f9', padding: '8px 15px', borderRadius: '8px', fontWeight: 900, color: '#1e40af' }}>{r.score}</div>
                <span style={{ fontWeight: 700 }}>{r.away}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#1e40af', borderRadius: '24px', padding: '40px', color: 'white' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '25px' }}>Table Standings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ opacity: 0.5, fontSize: '0.8rem', textAlign: 'left' }}><th style={{ paddingBottom: '15px' }}>POS</th><th>CLUB</th><th>P</th><th>PTS</th></tr></thead>
              <tbody>
                {data.standings.map((s, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '15px 0', fontWeight: 800, color: '#facc15' }}>{s.pos}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.p}</td>
                    <td style={{ fontWeight: 900 }}>{s.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/table" style={{ color: '#facc15', display: 'block', marginTop: '30px', fontWeight: 700, textDecoration: 'none' }}>VIEW FULL TABLE →</Link>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section style={{ padding: '60px 8%', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <h4 style={{ textAlign: 'center', color: '#64748b', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem', marginBottom: '40px' }}>Partners & Sponsors</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '30px', alignItems: 'center' }}>
          {sponsors.map((s, i) => (
            <img key={i} src={s.logo} alt={s.name} style={{ width: '100%', filter: 'grayscale(1)', opacity: 0.5, transition: '0.3s' }} onMouseOver={e => e.target.style.filter = 'grayscale(0)'} onMouseOut={e => e.target.style.filter = 'grayscale(1)'} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;