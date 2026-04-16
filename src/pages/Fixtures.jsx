import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Loader2, 
  AlertCircle,
  Filter
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
          logos[data.name] = data.logo; // Mapping name to logo URL
        });
        setTeamLogos(logos);

        // 2. Fetch Fixtures
        const q = query(collection(db, "fixtures"), orderBy("date", "asc"), orderBy("time", "asc"));
        const querySnapshot = await getDocs(q);
        const matchData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Extract unique matchdays for the filter
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

  // Filter Logic
  const filteredFixtures = selectedMatchday === 'All' 
    ? fixtures 
    : fixtures.filter(m => m.matchday === selectedMatchday);

  // Grouping Logic for the filtered list
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
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b' }}>Syncing Matchdays...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .fixtures-page { background-color: #f1f5f9; padding: 140px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 900px; margin: 0 auto; }
        
        .f-header { margin-bottom: 40px; text-align: center; }
        .f-title { font-family: 'Inter', sans-serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; letter-spacing: -2px; color: #0f172a; }
        
        /* Filter Styling */
        .filter-container { display: flex; justify-content: center; gap: 10px; margin-bottom: 40px; flex-wrap: wrap; }
        .filter-btn { 
          padding: 10px 20px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; 
          font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; font-size: 0.85rem;
        }
        .filter-btn.active { background: #1e40af; color: white; border-color: #1e40af; }

        .date-section { margin-bottom: 50px; }
        .date-badge { 
          display: inline-flex; align-items: center; gap: 8px; background: #fff; padding: 8px 16px; 
          border-radius: 10px; color: #1e40af; font-weight: 800; font-size: 0.8rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          margin-bottom: 20px; border-left: 4px solid #facc15;
        }

        .match-card {
          background: white; border-radius: 24px; padding: 25px; margin-bottom: 15px;
          display: grid; grid-template-columns: 1fr 120px 1fr; align-items: center;
          border: 1px solid #e2e8f0; transition: 0.3s;
        }
        .match-card:hover { border-color: #1e40af; transform: translateY(-2px); }

        .team-box { display: flex; align-items: center; gap: 15px; }
        .team-logo { width: 50px; height: 50px; object-fit: contain; background: #f8fafc; border-radius: 12px; padding: 5px; }
        .team-name { font-weight: 800; color: #0f172a; font-size: 1rem; }
        
        .home-team { justify-content: flex-end; text-align: right; }
        .away-team { justify-content: flex-start; text-align: left; }

        .time-box { text-align: center; border-left: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; }
        .time-text { font-family: 'Inter', sans-serif; font-size: 1.2rem; font-weight: 900; color: #1e40af; display: block; }
        .venue-text { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-top: 4px; }

        @media (max-width: 768px) {
          .match-card { grid-template-columns: 1fr; gap: 20px; }
          .home-team, .away-team { justify-content: center; text-align: center; flex-direction: column; }
          .time-box { border: none; background: #f8fafc; padding: 15px; border-radius: 15px; }
        }
      `}</style>

      <div className="fixtures-page">
        <div className="container">
          <header className="f-header">
            <h1 className="f-title">Match <span style={{color: '#1e40af'}}>Schedule.</span></h1>
            <p style={{ color: '#64748b', fontWeight: 600 }}>Track every moment of the St. Jerome season</p>
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
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '30px' }}>
              <AlertCircle size={40} color="#cbd5e1" style={{ margin: '0 auto 15px' }} />
              <h3 style={{fontWeight: 800}}>Fixtures Pending</h3>
              <p style={{color: '#64748b'}}>The matchday calendar is being updated by the league officials.</p>
            </div>
          ) : (
            Object.keys(groupedFixtures).map(date => (
              <div key={date} className="date-section">
                <div className="date-badge">
                  <Calendar size={14} /> {date} 
                  <span style={{color: '#cbd5e1', margin: '0 5px'}}>|</span> 
                  <MapPin size={14} /> {groupedFixtures[date][0].venue}
                </div>

                {groupedFixtures[date].map(match => (
                  <div key={match.id} className="match-card">
                    {/* HOME TEAM */}
                    <div className="team-box home-team">
                      <span className="team-name">{match.homeTeam}</span>
                      <img 
                        src={teamLogos[match.homeTeam] || 'https://via.placeholder.com/50'} 
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
                        src={teamLogos[match.awayTeam] || 'https://via.placeholder.com/50'} 
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