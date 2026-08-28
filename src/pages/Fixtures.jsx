import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { 
  Calendar, MapPin, Loader2, AlertCircle, Clock, LayoutGrid
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

        // Sorting by date descending (latest date on top) and time ascending (earliest game first)
        const q = query(
          collection(db, "fixtures"), 
          where("season", "==", selectedSeason),
          orderBy("date", "desc"),
          orderBy("time", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        const matchData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Handle dynamic matchdays (supports both numeric rounds and text like Gala fixtures)
        const mdays = [...new Set(matchData.map(m => m.matchday))].sort((a, b) => {
          const numA = Number(a);
          const numB = Number(b);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return String(a).localeCompare(String(b));
        });

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
    : fixtures.filter(m => String(m.matchday) === String(selectedMatchday));

  const groupedByMatchday = filteredFixtures.reduce((acc, match) => {
    const md = match.matchday;
    if (!acc[md]) acc[md] = [];
    acc[md].push(match);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#04060d' }}>
        <Loader2 className="animate-spin" size={48} color="#facc15" />
        <p style={{ marginTop: '20px', fontWeight: 800, color: '#facc15', letterSpacing: '2px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem' }}>
          SYNCING SCHEDULE...
        </p>
      </div>
    );
  }

  return (
    <div className="fixtures-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .fixtures-page { 
          background: #04060d; 
          min-height: 100vh; 
          padding: 120px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc;
          box-sizing: border-box;
        }

        .container { max-width: 920px; margin: 0 auto; }
        .gold-text { color: #facc15; }
        
        /* Header Box */
        .header-box { text-align: center; margin-bottom: 45px; }

        .header-tag {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .header-box h1 { 
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3rem, 7vw, 4.8rem); 
          color: #ffffff; 
          letter-spacing: 2px; 
          margin: 0 0 25px 0; 
          line-height: 1;
        }
        
        .selector-wrapper { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          align-items: center; 
        }
        
        /* Season Selector */
        .season-selector { 
          display: flex; 
          gap: 6px; 
          background: rgba(15, 23, 42, 0.8); 
          padding: 6px; 
          border-radius: 20px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          box-shadow: 0 10px 25px rgba(0,0,0,0.3); 
        }

        .season-pill { 
          padding: 10px 22px; 
          border-radius: 14px; 
          border: none; 
          background: transparent; 
          cursor: pointer; 
          font-weight: 800; 
          color: #94a3b8; 
          transition: all 0.3s ease; 
          font-size: 0.75rem; 
          letter-spacing: 0.5px;
        }

        .season-pill:hover { color: #ffffff; }

        .season-pill.active { 
          background: #facc15; 
          color: #04060d; 
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.25);
        }

        /* Matchday Filter */
        .filter-container { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }

        .filter-btn { 
          padding: 10px 18px; 
          border-radius: 14px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          background: rgba(15, 23, 42, 0.6); 
          font-weight: 700; 
          color: #94a3b8; 
          cursor: pointer; 
          font-size: 0.75rem; 
          transition: all 0.2s ease; 
          display: flex;
          align-items: center;
        }

        .filter-btn:hover { 
          border-color: rgba(250, 204, 21, 0.4); 
          color: #ffffff;
        }

        .filter-btn.active { 
          background: rgba(250, 204, 21, 0.12); 
          color: #facc15; 
          border-color: rgba(250, 204, 21, 0.4); 
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.1); 
        }

        /* Matchday Grouping */
        .md-section { margin-bottom: 50px; }
        .md-header { text-align: center; margin-bottom: 25px; }

        .md-badge { 
          font-family: 'Cinzel', serif;
          background: linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(250, 204, 21, 0.05)); 
          color: #facc15; 
          padding: 8px 24px; 
          border-radius: 30px; 
          font-weight: 700; 
          font-size: 0.8rem; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          border: 1px solid rgba(250, 204, 21, 0.3);
          display: inline-block;
        }

        .md-meta { 
          display: flex; 
          justify-content: center; 
          gap: 20px; 
          margin-top: 14px; 
          color: #94a3b8; 
          font-weight: 600; 
          font-size: 0.85rem; 
        }

        /* Match Cards */
        .match-card {
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          border-radius: 18px; 
          padding: 14px 24px; 
          margin-bottom: 10px;
          display: grid; 
          grid-template-columns: 1fr 95px 1fr; 
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.08); 
          box-shadow: 0 8px 20px rgba(0,0,0,0.25); 
          transition: all 0.3s ease;
        }

        .match-card:hover { 
          transform: translateY(-2px); 
          border-color: rgba(250, 204, 21, 0.3); 
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }

        .team { display: flex; align-items: center; gap: 14px; }
        .team.home { justify-content: flex-end; text-align: right; }
        .team.away { justify-content: flex-start; text-align: left; }
        
        .team-name { 
          font-family: 'Bebas Neue', cursive;
          font-size: 1.15rem; 
          color: #ffffff; 
          letter-spacing: 0.8px;
        }

        .logo-frame { 
          width: 38px; 
          height: 38px; 
          background: #04060d; 
          border-radius: 12px; 
          padding: 5px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 1px solid rgba(250, 204, 21, 0.2); 
          flex-shrink: 0; 
          box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
        }

        .logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .center-divider { 
          text-align: center; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 2px; 
          padding: 0 8px;
          border-left: 1px solid rgba(255, 255, 255, 0.06); 
          border-right: 1px solid rgba(255, 255, 255, 0.06); 
        }

        .time-val { 
          font-family: 'Bebas Neue', cursive;
          font-size: 1.35rem; 
          color: #facc15; 
          letter-spacing: 0.8px; 
          line-height: 1;
        }

        .vs-tag { 
          font-size: 0.55rem; 
          font-weight: 900; 
          color: #64748b; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
        }

        @media (max-width: 768px) {
          .fixtures-page { padding-top: 90px; padding-left: 12px; padding-right: 12px; }
          .header-box { margin-bottom: 25px; }
          .header-box h1 { font-size: 2.4rem; margin-bottom: 15px; }
          
          /* Compact Season Selector Box */
          .season-selector { padding: 4px; border-radius: 14px; gap: 4px; width: 100%; max-width: 340px; justify-content: space-between; }
          .season-pill { padding: 6px 10px; font-size: 0.65rem; border-radius: 10px; flex: 1; text-align: center; }

          /* Filter buttons compaction */
          .filter-btn { padding: 6px 12px; font-size: 0.7rem; border-radius: 10px; }

          /* Clean mobile view adjustments: smaller logos, unbolded text */
          .match-card { grid-template-columns: 1fr 55px 1fr; padding: 10px 8px; border-radius: 14px; margin-bottom: 8px; }
          .team { gap: 6px; }
          .team-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 0.75rem; line-height: 1.2; letter-spacing: normal; color: #f1f5f9; }
          .logo-frame { width: 24px; height: 24px; border-radius: 8px; padding: 3px; }
          .time-val { font-size: 0.95rem; }
          .vs-tag { font-size: 0.5rem; }
          .md-meta { font-size: 0.7rem; gap: 8px; flex-wrap: wrap; }
          .md-badge { padding: 6px 16px; font-size: 0.7rem; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <span className="header-tag">League Schedule</span>
          <h1>MATCH <span className="gold-text">FIXTURES</span></h1>
          
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
                <LayoutGrid size={13} style={{ marginRight: '6px' }}/> Full Roster
              </button>
              {availableMatchdays.map(md => (
                <button 
                  key={md} 
                  className={`filter-btn ${selectedMatchday === md ? 'active' : ''}`} 
                  onClick={() => setSelectedMatchday(md)}
                >
                  {isNaN(md) ? md : `Round ${md}`}
                </button>
              ))}
            </div>
          </div>
        </header>

        {fixtures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <AlertCircle size={48} className="gold-text" style={{ marginBottom: '15px' }}/>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: '#ffffff', margin: '0 0 5px 0' }}>No Fixtures Found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>The schedule for {selectedSeason} hasn't been released yet.</p>
          </div>
        ) : (
          Object.keys(groupedByMatchday).sort((a, b) => {
            const numA = Number(a);
            const numB = Number(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return String(a).localeCompare(String(b));
          }).map(md => (
            <div key={md} className="md-section">
              <div className="md-header">
                <span className="md-badge">{isNaN(md) ? md : `Matchday ${md}`}</span>
                <div className="md-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} color="#facc15"/> {groupedByMatchday[md][0].venue}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={15} color="#facc15"/> {groupedByMatchday[md][0].date}</span>
                </div>
              </div>

              {groupedByMatchday[md].map(match => (
                <div key={match.id} className="match-card">
                  {/* HOME */}
                  <div className="team home">
                    <span className="team-name">{match.homeTeam}</span>
                    <div className="logo-frame">
                      <img 
                        src={teamLogos[match.homeTeam] || `https://ui-avatars.com/api/?name=${match.homeTeam}&background=0f172a&color=facc15`} 
                        alt={match.homeTeam} 
                        className="logo-img" 
                      />
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="center-divider">
                    <span className="vs-tag">VS</span>
                    <span className="time-val">{match.time}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', fontSize: '0.55rem', fontWeight: 800 }}>
                       <Clock size={9} color="#facc15" /> UPCOMING
                    </div>
                  </div>

                  {/* AWAY */}
                  <div className="team away">
                    <div className="logo-frame">
                      <img 
                        src={teamLogos[match.awayTeam] || `https://ui-avatars.com/api/?name=${match.awayTeam}&background=0f172a&color=facc15`} 
                        alt={match.awayTeam} 
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