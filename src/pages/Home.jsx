import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { 
  ArrowRight, ChevronRight, Calendar, Trophy, User, Zap
} from 'lucide-react';

// Assets
import logo from '../assets/logo.jpeg';
import natalImg from '../assets/natal.jpeg';
import bachweziImg from '../assets/bachwezi.jpeg';
import netImg from '../assets/net.jpeg';
import fallImg from '../assets/fall.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [currentHero, setCurrentHero] = useState(0);
  const [data, setData] = useState({ 
    news: [], 
    results: [], 
    standings: [], 
    topScorers: [] 
  });

  const heroSlides = [
    { img: natalImg, title: "ST. JEROME LEAGUE", sub: "EXCELLENCE • COMMUNITY • PASSION" },
    { img: bachweziImg, title: "THE ARENA OF LEGENDS", sub: "WHERE HISTORY IS WRITTEN" },
    { img: netImg, title: "FOOTBALL REDEFINED", sub: "SEASON ONE IS LIVE" }
  ];

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        // 1. Fetch News (Defensive check for date fields)
        const newsSnap = await getDocs(query(collection(db, "news"), orderBy("date", "desc"), limit(5)));
        const fetchedNews = newsSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          displayDate: doc.data().date || "Latest"
        }));

        // 2. Fetch Results
        const resultsSnap = await getDocs(query(collection(db, "results"), orderBy("playedAt", "desc"), limit(3)));
        const fetchedResults = resultsSnap.docs.map(doc => doc.data());

        // 3. Fetch Standings (Ensuring numerical sorts don't fail if data is empty)
        const standingsSnap = await getDocs(query(collection(db, "standings"), orderBy("pts", "desc"), limit(5)));
        const fetchedStandings = standingsSnap.docs.map((doc, i) => ({ 
          pos: i + 1, 
          ...doc.data(),
          pts: doc.data().pts || 0,
          name: doc.data().name || "Unknown Club"
        }));

        // 4. Fetch Top Scorers
        const scorersSnap = await getDocs(query(collection(db, "players"), orderBy("goals", "desc"), limit(5)));
        const fetchedScorers = scorersSnap.docs.map(doc => ({
          ...doc.data(),
          goals: doc.data().goals || 0,
          name: doc.data().name || "Anonymous"
        }));

        setData({
          news: fetchedNews,
          results: fetchedResults,
          standings: fetchedStandings,
          topScorers: fetchedScorers
        });
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };

    fetchLeagueData();

    const heroInt = setInterval(() => {
      setCurrentHero(p => (p + 1) % heroSlides.length);
    }, 7000);
    
    return () => clearInterval(heroInt);
  }, []);

  return (
    <div className="home-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        .home-root { background-color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
        
        .hero-viewport { height: 90vh; position: relative; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0; filter: brightness(0.4); transform: scale(1.1); }
        .hero-bg.active { opacity: 1; transform: scale(1); }
        
        .logo-badge { width: 100px; height: 100px; background: white; border-radius: 50%; padding: 10px; margin: 0 auto 30px; border: 4px solid #facc15; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        
        .match-card { background: white; padding: 18px; border-radius: 20px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; text-align: center; margin-bottom: 12px; transition: 0.3s; }
        .match-card:hover { border-color: #1e3a8a; transform: translateX(5px); }
        .score-pill { background: #1e3a8a; color: #facc15; padding: 4px 12px; border-radius: 8px; font-weight: 900; font-size: 0.9rem; }
        
        .table-mini tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
        .table-mini td { padding: 14px 0; font-size: 0.85rem; }

        .pulse-card { transition: 0.3s; border: 1px solid #e2e8f0; }
        .pulse-card:hover { transform: translateY(-5px); border-color: #1e3a8a; box-shadow: 0 10px 25px -10px rgba(0,0,0,0.1); }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero-viewport">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-bg ${i === currentHero ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.img})` }} />
        ))}
        <div style={{ position: 'relative', zIndex: 10, color: 'white', textAlign: 'center', padding: '0 5%', maxWidth: '900px' }}>
          <img src={logo || ""} alt="League Logo" className="logo-badge" />
          <p style={{ color: '#facc15', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '15px', fontSize: '0.9rem' }}>
            {heroSlides[currentHero].sub}
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, margin: '0', textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: 1 }}>
            {heroSlides[currentHero].title}
          </h1>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '45px', flexWrap: 'wrap' }}>
            <Link to="/fixtures" style={{ background: '#facc15', color: '#1e3a8a', padding: '18px 35px', borderRadius: '15px', fontWeight: 800, textDecoration: 'none', transition: '0.3s' }}>MATCH CENTRE</Link>
            <Link to="/registration" style={{ border: '2px solid white', color: 'white', padding: '18px 35px', borderRadius: '15px', fontWeight: 700, textDecoration: 'none' }}>PLAYER REGISTRATION</Link>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section style={{ padding: '80px 5%', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* NEWS BRIEF */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>League Pulse</h2>
              <Link to="/news" style={{ color: '#1e3a8a', fontWeight: 800, textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                VIEW ALL <ArrowRight size={16} />
              </Link>
            </div>
            
            {data.news.length === 0 ? (
               <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '25px', color: '#94a3b8' }}>Loading news...</div>
            ) : data.news.map(item => (
              <div key={item.id} onClick={() => navigate(`/news`)} className="pulse-card" style={{ display: 'flex', gap: '15px', background: 'white', padding: '12px', borderRadius: '20px', marginBottom: '15px', cursor: 'pointer' }}>
                <img src={item.image || item.imageUrl || fallImg} style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover' }} alt="" />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#facc15', textTransform: 'uppercase' }}>{item.displayDate}</span>
                  <h4 style={{ margin: '4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1.3 }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.excerpt || (item.content ? item.content.substring(0, 60) + '...' : '')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* STANDINGS */}
          <div style={{ background: '#1e3a8a', borderRadius: '35px', padding: '40px', color: 'white', boxShadow: '0 20px 40px -15px rgba(30, 58, 138, 0.4)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', fontSize: '1.5rem', fontWeight: 900 }}>
              <Trophy color="#facc15" size={28} /> Table Leaders
            </h3>
            <table className="table-mini" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ opacity: 0.5, fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '15px' }}>Pos</th>
                  <th>Club</th>
                  <th>P</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {data.standings.map(s => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 900, color: '#facc15', fontSize: '1rem' }}>{s.pos}</td>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td style={{ opacity: 0.8 }}>{s.played || s.p || 0}</td>
                    <td style={{ fontWeight: 900, fontSize: '1rem' }}>{s.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/table" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '30px', color: '#facc15', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
              FULL STANDINGS <ChevronRight size={18} />
            </Link>
          </div>

          {/* RESULTS & SCORERS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '20px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} fill="#facc15" color="#facc15" /> Recent Results
              </h3>
              {data.results.map((r, i) => (
                <div key={i} className="match-card">
                  <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e3a8a' }}>{r.homeTeam}</span>
                  <div className="score-pill">{r.score}</div>
                  <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e3a8a' }}>{r.awayTeam}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={20} color="#facc15" /> Golden Boot
              </h3>
              {data.topScorers.map((player, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === data.topScorers.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e3a8a' }}>{player.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{player.team}</div>
                  </div>
                  <div style={{ fontWeight: 900, color: '#1e3a8a', fontSize: '1.1rem' }}>{player.goals}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* PARTNERS */}
      <section style={{ padding: '60px 5%', textAlign: 'center', background: 'white', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.7rem', fontWeight: 900, color: '#cbd5e1', marginBottom: '40px' }}>Strategic Partners</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
          {["PARTNER 1", "PARTNER 2", "PARTNER 3", "PARTNER 4"].map(p => (
            <span key={p} style={{ 
              fontWeight: 900, 
              color: '#1e3a8a', 
              fontSize: '1rem', 
              opacity: 0.3,
              border: '2px solid #1e3a8a',
              padding: '8px 20px',
              borderRadius: '8px'
            }}>{p}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;