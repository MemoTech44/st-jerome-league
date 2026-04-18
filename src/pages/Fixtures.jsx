import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Calendar, 
  MapPin, 
  Loader2, 
  AlertCircle,
  Trophy,
  ChevronRight
} from 'lucide-react';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMatchday, setSelectedMatchday] = useState('All');
  const [availableMatchdays, setAvailableMatchdays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Team Logos for the mapping
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const logos = {};
        teamsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          logos[data.name] = data.logoUrl || data.logo; 
        });
        setTeamLogos(logos);

        // 2. Fetch Fixtures
        const q = query(collection(db, "fixtures"), orderBy("date", "asc"), orderBy("time", "asc"));
        const querySnapshot = await getDocs(q);
        const matchData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const mdays = [...new Set(matchData.map(m => m.matchday))].filter(Boolean).sort();
        setAvailableMatchdays(mdays);
        setFixtures(matchData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFixtures = selectedMatchday === 'All' 
    ? fixtures 
    : fixtures.filter(m => m.matchday === selectedMatchday);

  const groupedFixtures = filteredFixtures.reduce((acc, match) => {
    const dateKey = match.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <Loader2 className="animate-spin" size={48} color="#1e40af" />
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b', fontFamily: 'Plus Jakarta Sans' }}>Syncing Matchdays...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .fixtures-page { background-color: #f1f5f9; padding: 140px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; }
        .container { max-width: 900px; margin: 0 auto; }
        
        /* --- HEADER --- */
        .header-box { text-align: center; margin-bottom: 60px; }
        .header-box h1 { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(2.5rem, 7vw, 4rem); 
          letter-spacing: -2px; 
          color: #1e40af; 
          margin-bottom: 15px;
          font-weight: 800;
        }
        .header-description {
          max-width: 600px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #64748b;
          font-weight: 500;
        }

        /* --- FILTERS --- */
        .filter-container { display: flex; justify-content: center; gap: 12px; margin-bottom: 50px; flex-wrap: wrap; }
        .filter-btn { 
          padding: 12px 24px; border-radius: 15px; border: 1px solid #e2e8f0; background: white; 
          font-weight: 800; color: #64748b; cursor: pointer; transition: 0.3s; font-size: 0.85rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .filter-btn:hover { border-color: #1e40af; color: #1e40af; }
        .filter-btn.active { background: #1e40af; color: white; border-color: #1e40af; box-shadow: 0 10px 20px rgba(30, 64, 175, 0.2); }

        /* --- DATE GROUPS --- */
        .date-section { margin-bottom: 60px; }
        .date-badge { 
          display: inline-flex; align-items: center; gap: 10px; background: #fff; padding: 10px 20px; 
          border-radius: 15px; color: #1e40af; font-weight: 800; font-size: 0.85rem; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          margin-bottom: 25px; border-left: 5px solid #facc15;
        }

        /* --- MATCH CARDS --- */
        .match-card {
          background: white; border-radius: 35px; padding: 30px; margin-bottom: 20px;
          display: grid; grid-template-columns: 1fr 140px 1fr; align-items: center;
          border: 1px solid #e2e8f0; transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .match-card:hover { border-color: #1e40af; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }

        .team-box { display: flex; align-items: center; gap: 20px; }
        .team-logo { width: 60px; height: 60px; object-fit: contain; background: #f8fafc; border-radius: 18px; padding: 8px; border: 1px solid #f1f5f9; }
        .team-name { font-weight: 800; color: #0f172a; font-size: 1.1rem; }
        
        .home-team { justify-content: flex-end; text-align: right; }
        .away-team { justify-content: flex-start; text-align: left; }

        .time-box { text-align: center; border-left: 2px solid #f1f5f9; border-right: 2px solid #f1f5f9; padding: 0 10px; }
        .time-text { font-family: 'Inter', sans-serif; font-size: 1.4rem; font-weight: 900; color: #1e40af; display: block; letter-spacing: -1px; }
        .venue-text { font-size: 0.7rem; color: #facc15; font-weight: 900; text-transform: uppercase; margin-top: 5px; letter-spacing: 1px; }

        @media (max-width: 800px) {
          .match-card { grid-template-columns: 1fr; gap: 25px; padding: 40px 30px; border-radius: 40px; }
          .home-team, .away-team { justify-content: center; text-align: center; flex-direction: column; }
          .home-team { flex-direction: column-reverse; }
          .time-box { border: none; background: #f8fafc; padding: 20px; border-radius: 25px; order: -1; }
          .team-logo { width: 70px; height: 70px; }
        }
      `}</style>

      <div className="fixtures-page">
        <div className="container">
          <header className="header-box">
            <h1>Match Schedule</h1>
            <p className="header-description">
              Stay on top of the action. Track every upcoming match, kickoff times, and venues for the current St. Jerome season.
            </p>
          </header>

          {/* MATCHDAY FILTER */}
          <div className="filter-container">
            <button 
              className={`filter-btn ${selectedMatchday === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedMatchday('All')}
            >
              Full Season
            </button>
            {availableMatchdays.map(md => (
              <button 
                key={md}
                className={`filter-btn ${selectedMatchday === md ? 'active' : ''}`}
                onClick={() => setSelectedMatchday(md)}
              >
                Matchday {md}
              </button>
            ))}
          </div>

          {fixtures.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', borderRadius: '45px', border: '1px solid #e2e8f0' }}>
              <AlertCircle size={50} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
              <h3 style={{fontWeight: 800, fontSize: '1.5rem', color: '#0f172a'}}>Fixtures Pending</h3>
              <p style={{color: '#64748b', fontWeight: 500}}>The matchday calendar is currently being finalized by the league officials.</p>
            </div>
          ) : (
            Object.keys(groupedFixtures).map(date => (
              <div key={date} className="date-section">
                <div className="date-badge">
                  <Calendar size={16} /> {date} 
                  <span style={{color: '#e2e8f0', margin: '0 5px'}}>|</span> 
                  <MapPin size={16} color="#facc15" /> {groupedFixtures[date][0].venue}
                </div>

                {groupedFixtures[date].map(match => (
                  <div key={match.id} className="match-card">
                    {/* HOME TEAM */}
                    <div className="team-box home-team">
                      <span className="team-name">{match.homeTeam}</span>
                      <img 
                        src={teamLogos[match.homeTeam] || 'https://via.placeholder.com/60'} 
                        alt="" 
                        className="team-logo" 
                      />
                    </div>

                    {/* TIME INFO */}
                    <div className="time-box">
                      <span className="time-text">{match.time}</span>
                      <div className="venue-text">Kick Off</div>
                    </div>

                    {/* AWAY TEAM */}
                    <div className="team-box away-team">
                      <img 
                        src={teamLogos[match.awayTeam] || 'https://via.placeholder.com/60'} 
                        alt="" 
                        className="team-logo" 
                      />
                      <span className="team-name">{match.awayTeam}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Fixtures;