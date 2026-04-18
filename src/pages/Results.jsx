import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Loader2, 
  AlertCircle,
  History
} from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMatchday, setSelectedMatchday] = useState('All');
  const [availableMatchdays, setAvailableMatchdays] = useState([]);

  useEffect(() => {
    const fetchResultsData = async () => {
      try {
        // 1. Fetch Team Logos
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const logos = {};
        teamsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          logos[data.name] = data.logo;
        });
        setTeamLogos(logos);

        // 2. Fetch Results (Most recent matches first)
        const q = query(collection(db, "results"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const matchResults = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Extract unique matchdays for the filter
        const mdays = [...new Set(matchResults.map(m => m.matchday))].filter(Boolean).sort((a, b) => b - a);
        setAvailableMatchdays(mdays);
        setResults(matchResults);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultsData();
  }, []);

  const filteredResults = selectedMatchday === 'All' 
    ? results 
    : results.filter(m => m.matchday === selectedMatchday);

  const groupedResults = filteredResults.reduce((acc, match) => {
    const dateKey = match.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <Loader2 className="animate-spin" size={48} color="#1e40af" />
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b', fontFamily: 'Plus Jakarta Sans' }}>Updating Scoreboards...</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .results-page { background-color: #f1f5f9; padding: 140px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 900px; margin: 0 auto; }
        
        .results-header { margin-bottom: 50px; text-align: center; }
        .results-title { font-family: 'Inter', sans-serif; font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; letter-spacing: -2px; color: #0f172a; margin: 0; }
        .accent-blue { color: #1e40af; }

        /* Filter Tabs */
        .filter-scroll-container { 
          display: flex; gap: 10px; margin-bottom: 40px; overflow-x: auto; 
          padding: 10px 5px; scrollbar-width: none; -ms-overflow-style: none;
          justify-content: flex-start;
        }
        .filter-scroll-container::-webkit-scrollbar { display: none; }
        
        .filter-btn { 
          padding: 12px 24px; border-radius: 16px; border: none; background: white; 
          font-weight: 800; color: #64748b; cursor: pointer; transition: 0.3s; 
          font-size: 0.85rem; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          border: 1px solid #e2e8f0;
        }
        .filter-btn.active { background: #1e40af; color: white; border-color: #1e40af; box-shadow: 0 10px 20px rgba(30, 64, 175, 0.2); }

        .date-section { margin-bottom: 50px; }
        .date-header {
          display: flex; align-items: center; gap: 10px; color: #1e40af; font-weight: 800;
          font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;
          background: #eff6ff; width: fit-content; padding: 10px 25px; border-radius: 50px;
        }

        /* Match Card Grid */
        .match-card {
          background: white; border-radius: 35px; padding: 35px; margin-bottom: 15px;
          display: flex; align-items: center; justify-content: space-between;
          border: 1px solid #e2e8f0; transition: 0.3s;
        }
        .match-card:hover { border-color: #1e40af; transform: scale(1.01); }

        .team-side { display: flex; align-items: center; gap: 20px; width: 35%; flex: 1; }
        .team-home { justify-content: flex-end; text-align: right; }
        .team-away { justify-content: flex-start; text-align: left; }
        
        .team-name { font-weight: 800; font-size: 1.1rem; color: #0f172a; }
        .team-logo-circle { 
          width: 60px; height: 60px; min-width: 60px; border-radius: 20px; 
          background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px; 
          display: flex; align-items: center; justify-content: center;
        }
        .team-logo-img { width: 100%; height: 100%; object-fit: contain; }

        .score-center { display: flex; flex-direction: column; align-items: center; min-width: 140px; }
        .score-display {
          background: #0f172a; padding: 12px 28px; border-radius: 20px;
          font-family: 'Inter', sans-serif; font-size: 2.2rem; font-weight: 900;
          color: #facc15; display: flex; gap: 15px; align-items: center;
        }
        .score-divider { opacity: 0.2; color: white; font-size: 1.5rem; }

        .venue-info { 
          display: flex; align-items: center; gap: 6px; color: #94a3b8; 
          font-size: 0.75rem; margin-top: 15px; font-weight: 700;
        }

        /* Responsive Breakpoint */
        @media (max-width: 768px) {
          .results-page { padding-top: 110px; }
          .match-card { flex-direction: column; padding: 30px 20px; gap: 20px; }
          .team-side { width: 100%; justify-content: center; text-align: center; }
          .team-home { flex-direction: column-reverse; }
          .team-away { flex-direction: column; }
          .score-display { font-size: 1.8rem; padding: 10px 24px; }
          .filter-scroll-container { justify-content: flex-start; padding-left: 0; }
        }
      `}</style>

      <div className="container">
        <header className="results-header">
          <h1 className="results-title">League <span className="accent-blue">Results.</span></h1>
          <p style={{ color: '#64748b', fontWeight: 600, marginTop: '10px', fontSize: '1.1rem' }}>
            Official scorelines from the current campaign.
          </p>
        </header>

        {/* HORIZONTAL FILTER */}
        <div className="filter-scroll-container">
          <button 
            className={`filter-btn ${selectedMatchday === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedMatchday('All')}
          >
            All Results
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

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0' }}>
            <AlertCircle size={50} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
            <h3 style={{fontWeight: 800, color: '#0f172a'}}>No Results Logged</h3>
            <p style={{color: '#64748b', fontWeight: 600}}>Scores will appear once the final whistle blows.</p>
          </div>
        ) : (
          Object.keys(groupedResults).map(date => (
            <div key={date} className="date-section">
              <div className="date-header">
                <Calendar size={14} />
                {date}
              </div>

              {groupedResults[date].map((match) => (
                <div key={match.id} className="match-card">
                  {/* HOME TEAM */}
                  <div className="team-side team-home">
                    <div className="team-name">{match.homeTeam}</div>
                    <div className="team-logo-circle">
                      <img 
                        src={teamLogos[match.homeTeam] || 'https://via.placeholder.com/60'} 
                        className="team-logo-img" 
                        alt="" 
                      />
                    </div>
                  </div>

                  {/* CENTER SCORE */}
                  <div className="score-center">
                    <div className="score-display">
                      <span>{match.homeScore}</span>
                      <span className="score-divider">|</span>
                      <span>{match.awayScore}</span>
                    </div>
                    <div className="venue-info">
                      <MapPin size={12} /> {match.venue || 'TBA'}
                    </div>
                  </div>

                  {/* AWAY TEAM */}
                  <div className="team-side team-away">
                    <div className="team-logo-circle">
                      <img 
                        src={teamLogos[match.awayTeam] || 'https://via.placeholder.com/60'} 
                        className="team-logo-img" 
                        alt="" 
                      />
                    </div>
                    <div className="team-name">{match.awayTeam}</div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
            <History size={14} /> SEASON 2026 ARCHIVE
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;