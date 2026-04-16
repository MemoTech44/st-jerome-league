import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Loader2, 
  AlertCircle 
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
        // 1. Fetch Team Logos for the mapping
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

  // Filter Logic
  const filteredResults = selectedMatchday === 'All' 
    ? results 
    : results.filter(m => m.matchday === selectedMatchday);

  // Grouping by Date
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
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b' }}>Updating Scoreboards...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .results-page { background-color: #f1f5f9; padding: 140px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1000px; margin: 0 auto; }
        
        .results-header { margin-bottom: 40px; text-align: center; }
        .results-title { font-family: 'Inter', sans-serif; font-size: 3.5rem; font-weight: 900; letter-spacing: -2px; color: #0f172a; margin: 0; }
        .accent-blue { color: #1e40af; }

        /* Filter Styling */
        .filter-container { display: flex; justify-content: center; gap: 10px; margin-bottom: 40px; flex-wrap: wrap; }
        .filter-btn { 
          padding: 10px 20px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; 
          font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; font-size: 0.85rem;
        }
        .filter-btn.active { background: #1e40af; color: white; border-color: #1e40af; }

        .date-section { margin-bottom: 40px; }
        .date-header {
          display: flex; align-items: center; gap: 12px; color: #64748b; font-weight: 800;
          font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px;
          background: white; width: fit-content; padding: 8px 20px; border-radius: 50px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .match-card {
          background: white; border-radius: 24px; padding: 30px; margin-bottom: 15px;
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
          transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid #e2e8f0;
        }
        .match-card:hover { transform: translateY(-4px); border-color: #1e40af; }

        .team-box { display: flex; align-items: center; gap: 15px; font-weight: 800; font-size: 1.1rem; color: #0f172a; }
        .team-home { justify-content: flex-end; text-align: right; }
        .team-away { justify-content: flex-start; text-align: left; }
        
        .team-logo { width: 45px; height: 45px; object-fit: contain; background: #f8fafc; border-radius: 10px; padding: 5px; }
        .winner { color: #1e40af; }

        .score-box { display: flex; flex-direction: column; align-items: center; padding: 0 40px; }
        .score-pill {
          background: #1e40af; padding: 8px 24px; border-radius: 12px;
          font-family: 'Inter', sans-serif; font-size: 1.8rem; font-weight: 900;
          color: #facc15; display: flex; gap: 12px; box-shadow: 0 10px 15px -3px rgba(30, 64, 175, 0.2);
        }

        .status-ft { font-size: 0.7rem; font-weight: 900; background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 6px; margin-top: 12px; letter-spacing: 1px; }

        @media (max-width: 768px) {
          .match-card { grid-template-columns: 1fr; gap: 15px; }
          .team-home, .team-away { justify-content: center; text-align: center; flex-direction: column; }
          .score-box { padding: 15px 0; }
        }
      `}</style>

      <div className="results-page">
        <div className="container">
          <header className="results-header">
            <h1 className="results-title">Match <span className="accent-blue">Results.</span></h1>
            <p style={{ color: '#64748b', fontWeight: 600, marginTop: '10px' }}>Final scorelines from the St. Jerome campaign.</p>
          </header>

          {/* MATCHDAY FILTER */}
          <div className="filter-container">
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
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '30px' }}>
              <AlertCircle size={40} color="#cbd5e1" style={{ margin: '0 auto 15px' }} />
              <h3 style={{fontWeight: 800}}>No Results Recorded</h3>
              <p style={{color: '#64748b'}}>The season scores will appear here once matches are completed.</p>
            </div>
          ) : (
            Object.keys(groupedResults).map(date => (
              <div key={date} className="date-section">
                <div className="date-header">
                  <Calendar size={16} color="#1e40af" />
                  {date}
                </div>

                {groupedResults[date].map((match) => (
                  <div key={match.id} className="match-card">
                    {/* Home Team */}
                    <div className={`team-box team-home ${match.homeScore > match.awayScore ? 'winner' : ''}`}>
                      <span className="team-name">{match.homeTeam}</span>
                      <img 
                        src={teamLogos[match.homeTeam] || 'https://via.placeholder.com/50'} 
                        alt="" 
                        className="team-logo" 
                      />
                      {match.homeScore > match.awayScore && <Trophy size={18} color="#facc15" />}
                    </div>

                    {/* Scoreboard */}
                    <div className="score-box">
                      <div className="score-pill">
                        <span>{match.homeScore}</span>
                        <span style={{ opacity: 0.3 }}>-</span>
                        <span>{match.awayScore}</span>
                      </div>
                      <span className="status-ft">FULL TIME</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.75rem', marginTop: '8px', fontWeight: 600 }}>
                        <MapPin size={12} /> {match.venue}
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className={`team-box team-away ${match.awayScore > match.homeScore ? 'winner' : ''}`}>
                      {match.awayScore > match.homeScore && <Trophy size={18} color="#facc15" />}
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

export default Results;