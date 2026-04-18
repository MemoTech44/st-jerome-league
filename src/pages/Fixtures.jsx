import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { 
  Calendar, MapPin, Loader2, AlertCircle, Clock, ChevronRight, LayoutGrid
} from 'lucide-react';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("Season 2");
  const [selectedMatchday, setSelectedMatchday] = useState('All');
  const [availableMatchdays, setAvailableMatchdays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const logos = {};
        teamsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          logos[data.name] = data.logoUrl || data.logo; 
        });
        setTeamLogos(logos);

        const q = query(
          collection(db, "fixtures"), 
          where("season", "==", selectedSeason),
          orderBy("matchday", "asc"),
          orderBy("time", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        const matchData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const mdays = [...new Set(matchData.map(m => m.matchday))].sort((a, b) => Number(a) - Number(b));
        setAvailableMatchdays(mdays);
        setFixtures(matchData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSeason]);

  const filteredFixtures = selectedMatchday === 'All' 
    ? fixtures 
    : fixtures.filter(m => Number(m.matchday) === Number(selectedMatchday));

  const groupedByMatchday = filteredFixtures.reduce((acc, match) => {
    const md = match.matchday;
    if (!acc[md]) acc[md] = [];
    acc[md].push(match);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={48} color="#1e3a8a" />
        <p style={{ marginTop: '20px', fontWeight: 800, color: '#1e3a8a', letterSpacing: '1px', fontFamily: 'Plus Jakarta Sans' }}>SYNCING SCHEDULE...</p>
      </div>
    );
  }

  return (
    <div className="fixtures-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .fixtures-page { background: #f8fafc; min-height: 100vh; padding: 140px 5% 100px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 900px; margin: 0 auto; }
        
        /* Header & Selectors */
        .header-box { text-align: center; margin-bottom: 50px; }
        .header-box h1 { font-size: clamp(2.5rem, 6vw, 3.5rem); color: #1e3a8a; font-weight: 800; letter-spacing: -2px; margin-bottom: 25px; }
        
        .selector-wrapper { display: flex; flex-direction: column; gap: 15px; align-items: center; margin-bottom: 40px; }
        
        .season-selector { display: flex; gap: 8px; background: white; padding: 6px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .season-pill { padding: 10px 20px; border-radius: 14px; border: none; background: transparent; cursor: pointer; font-weight: 800; color: #64748b; transition: 0.3s; font-size: 0.75rem; }
        .season-pill.active { background: #1e3a8a; color: white; }

        .filter-container { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .filter-btn { 
          padding: 10px 18px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; 
          font-weight: 700; color: #64748b; cursor: pointer; font-size: 0.75rem; transition: 0.2s; 
        }
        .filter-btn:hover { border-color: #facc15; }
        .filter-btn.active { background: #facc15; color: #1e3a8a; border-color: #facc15; box-shadow: 0 4px 12px rgba(250, 204, 21, 0.2); }

        /* Matchday Grouping */
        .md-section { margin-bottom: 60px; }
        .md-header { text-align: center; margin-bottom: 30px; }
        .md-badge { background: #1e3a8a; color: white; padding: 8px 24px; border-radius: 30px; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1.5px; }
        .md-meta { display: flex; justify-content: center; gap: 20px; margin-top: 15px; color: #94a3b8; font-weight: 700; font-size: 0.85rem; }

        /* Match Cards */
        .match-card {
          background: white; border-radius: 32px; padding: 25px 40px; margin-bottom: 12px;
          display: grid; grid-template-columns: 1fr 120px 1fr; align-items: center;
          border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.03); transition: 0.3s;
        }
        .match-card:hover { transform: scale(1.01); border-color: #cbd5e1; }

        .team { display: flex; align-items: center; gap: 20px; }
        .team.home { justify-content: flex-end; text-align: right; }
        .team.away { justify-content: flex-start; text-align: left; }
        
        .team-name { font-weight: 800; color: #1e293b; font-size: 1.1rem; text-transform: uppercase; }
        .logo-frame { 
          width: 60px; height: 60px; background: #f8fafc; border-radius: 18px; 
          padding: 8px; display: flex; align-items: center; justify-content: center; 
          border: 1px solid #f1f5f9; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }
        .logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .center-divider { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; border-left: 2px solid #f1f5f9; border-right: 2px solid #f1f5f9; }
        .time-val { font-size: 1.4rem; font-weight: 800; color: #1e3a8a; letter-spacing: -1px; }
        .vs-tag { font-size: 0.65rem; font-weight: 900; color: #facc15; text-transform: uppercase; letter-spacing: 1px; }

        @media (max-width: 768px) {
          .match-card { grid-template-columns: 1fr 80px 1fr; padding: 20px 15px; border-radius: 24px; }
          .team { gap: 10px; }
          .team-name { font-size: 0.75rem; }
          .logo-frame { width: 45px; height: 45px; border-radius: 12px; }
          .time-val { font-size: 1.1rem; }
          .md-meta { font-size: 0.75rem; gap: 10px; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <h1>Match Schedule</h1>
          
          <div className="selector-wrapper">
            <div className="season-selector">
              {["Season 1", "Season 2", "Season 3", "Season 4"].map(s => (
                <button 
                  key={s} 
                  className={`season-pill ${selectedSeason === s ? 'active' : ''}`} 
                  onClick={() => setSelectedSeason(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="filter-container">
              <button 
                className={`filter-btn ${selectedMatchday === 'All' ? 'active' : ''}`} 
                onClick={() => setSelectedMatchday('All')}
              >
                <LayoutGrid size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }}/> Full Roster
              </button>
              {availableMatchdays.map(md => (
                <button 
                  key={md} 
                  className={`filter-btn ${selectedMatchday === md ? 'active' : ''}`} 
                  onClick={() => setSelectedMatchday(md)}
                >
                  Round {md}
                </button>
              ))}
            </div>
          </div>
        </header>

        {fixtures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0' }}>
            <AlertCircle size={50} color="#cbd5e1" style={{ marginBottom: '20px' }}/>
            <h3 style={{ fontWeight: 800, color: '#1e3a8a', marginBottom: '10px' }}>No Fixtures Found</h3>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>The schedule for {selectedSeason} hasn't been released yet.</p>
          </div>
        ) : (
          Object.keys(groupedByMatchday).sort((a,b) => Number(a)-Number(b)).map(md => (
            <div key={md} className="md-section">
              <div className="md-header">
                <span className="md-badge">Matchday {md}</span>
                <div className="md-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="#facc15"/> {groupedByMatchday[md][0].venue}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} color="#facc15"/> {groupedByMatchday[md][0].date}</span>
                </div>
              </div>

              {groupedByMatchday[md].map(match => (
                <div key={match.id} className="match-card">
                  {/* HOME */}
                  <div className="team home">
                    <span className="team-name">{match.homeTeam}</span>
                    <div className="logo-frame">
                      <img 
                        src={teamLogos[match.homeTeam] || `https://ui-avatars.com/api/?name=${match.homeTeam}&background=f1f5f9&color=1e3a8a`} 
                        alt="" 
                        className="logo-img" 
                      />
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="center-divider">
                    <span className="vs-tag">VS</span>
                    <span className="time-val">{match.time}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#94a3b8', fontSize: '0.6rem', fontWeight: 800 }}>
                       <Clock size={10} /> LIVE
                    </div>
                  </div>

                  {/* AWAY */}
                  <div className="team away">
                    <div className="logo-frame">
                      <img 
                        src={teamLogos[match.awayTeam] || `https://ui-avatars.com/api/?name=${match.awayTeam}&background=f1f5f9&color=1e3a8a`} 
                        alt="" 
                        className="logo-img" 
                      />
                    </div>
                    <span className="team-name">{match.awayTeam}</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Fixtures;