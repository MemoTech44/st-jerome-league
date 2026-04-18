import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { 
  MapPin, 
  Loader2, 
  AlertCircle,
  Trophy,
  History
} from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [selectedSeason, setSelectedSeason] = useState("Season 2");
  const [selectedMatchday, setSelectedMatchday] = useState(1);

  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5"];
  const matchdays = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchResultsData = async () => {
      setLoading(true);
      try {
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const logos = {};
        teamsSnapshot.docs.forEach(doc => {
          logos[doc.data().name] = doc.data().logo;
        });
        setTeamLogos(logos);

        const q = query(
          collection(db, "fixtures"), 
          where("status", "==", "completed"),
          where("season", "==", selectedSeason),
          where("matchday", "==", Number(selectedMatchday)),
          orderBy("date", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        setResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultsData();
  }, [selectedSeason, selectedMatchday]);

  return (
    <div className="results-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

        .results-page { 
          background: #f8fafc; 
          padding: 140px 5% 80px; 
          min-height: 100vh; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
        }
        .container { max-width: 1000px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 40px; }
        .header-box h1 { 
          font-size: clamp(2.2rem, 5vw, 3rem); 
          font-weight: 800; 
          color: #1e3a8a; 
          letter-spacing: -1px;
          margin: 0;
        }
        .header-underline {
          width: 50px;
          height: 5px;
          background: #facc15;
          margin: 15px auto;
          border-radius: 10px;
        }

        /* Filter System */
        .filter-section { margin-bottom: 40px; }
        
        .season-tabs { 
          display: flex; justify-content: center; gap: 8px; margin-bottom: 25px; 
          background: #f1f5f9; padding: 6px; width: fit-content; margin: 0 auto 25px; border-radius: 16px;
        }
        .season-btn { 
          padding: 10px 20px; border-radius: 12px; border: none; background: transparent; 
          color: #64748b; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.3s;
        }
        .season-btn.active { background: #1e3a8a; color: #facc15; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15); }

        .md-scroll { 
          display: flex; gap: 12px; overflow-x: auto; padding: 10px 5px 20px; 
          scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;
        }
        .md-pill { 
          padding: 12px 28px; border-radius: 14px; border: 1px solid #e2e8f0; background: white; 
          color: #1e3a8a; font-weight: 800; cursor: pointer; white-space: nowrap; font-size: 0.85rem;
          transition: 0.3s ease; flex-shrink: 0;
        }
        .md-pill:hover { border-color: #1e3a8a; }
        .md-pill.active { background: #1e3a8a; color: #facc15; border-color: #1e3a8a; transform: translateY(-2px); }

        /* Result Cards */
        .result-card { 
          background: white; border-radius: 24px; padding: 30px; margin-bottom: 20px;
          display: grid; grid-template-columns: 1.2fr 180px 1.2fr; align-items: center;
          border: 1px solid #e2e8f0; transition: 0.3s ease;
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.05);
        }
        .result-card:hover { transform: scale(1.01); border-color: #1e3a8a; }

        .team-info { display: flex; align-items: center; gap: 20px; }
        .team-info.home { justify-content: flex-end; text-align: right; }
        .team-name { font-weight: 800; color: #1e293b; font-size: 1.1rem; letter-spacing: -0.3px; }
        
        .logo-box { 
          width: 56px; height: 56px; background: #f8fafc; border-radius: 16px; 
          padding: 8px; border: 1px solid #f1f5f9; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-box img { width: 100%; height: 100%; object-fit: contain; }

        .score-center { text-align: center; }
        .score-box { 
          background: #1e3a8a; color: #facc15; font-size: 2.2rem; font-weight: 800; 
          padding: 8px 24px; border-radius: 16px; display: inline-flex; gap: 12px;
          align-items: center; line-height: 1;
        }
        .score-box span { min-width: 25px; }
        
        .venue-tag { 
          margin-top: 12px; font-size: 0.75rem; color: #64748b; font-weight: 700; 
          display: flex; align-items: center; justify-content: center; gap: 4px;
        }

        @media (max-width: 850px) {
          .result-card { grid-template-columns: 1fr; gap: 25px; padding: 40px 20px; }
          .team-info.home { flex-direction: column-reverse; text-align: center; }
          .team-info { flex-direction: column; text-align: center; }
          .score-box { font-size: 1.8rem; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <h1>Match Archives</h1>
          <div className="header-underline"></div>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Official results and scoring history</p>
        </header>

        <div className="filter-section">
          <div className="season-tabs">
            {seasons.map(s => (
              <button 
                key={s} 
                className={`season-btn ${selectedSeason === s ? 'active' : ''}`}
                onClick={() => setSelectedSeason(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="md-scroll">
            {matchdays.map(m => (
              <button 
                key={m} 
                className={`md-pill ${selectedMatchday === m ? 'active' : ''}`}
                onClick={() => setSelectedMatchday(m)}
              >
                MATCHDAY {m}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={40} color="#1e3a8a" style={{margin: '0 auto'}}/>
            <p style={{ marginTop: '15px', fontWeight: 700, color: '#64748b' }}>Fetching results...</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <History size={48} color="#cbd5e1" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: '#1e3a8a', fontWeight: 800, fontSize: '1.5rem', margin: '0 0 10px' }}>No Data Available</h3>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Records for {selectedSeason} Matchday {selectedMatchday} haven't been finalized.</p>
          </div>
        ) : (
          results.map((match) => (
            <div key={match.id} className="result-card">
              <div className="team-info home">
                <span className="team-name">{match.homeTeam}</span>
                <div className="logo-box">
                  <img src={teamLogos[match.homeTeam] || '/placeholder.png'} alt={match.homeTeam} />
                </div>
              </div>

              <div className="score-center">
                <div className="score-box">
                  <span>{match.homeScore}</span>
                  <span style={{ opacity: 0.2, fontSize: '1.2rem' }}>|</span>
                  <span>{match.awayScore}</span>
                </div>
                <div className="venue-tag">
                  <MapPin size={12} strokeWidth={3}/> {match.venue || "Arena"}
                </div>
              </div>

              <div className="team-info">
                <div className="logo-box">
                  <img src={teamLogos[match.awayTeam] || '/placeholder.png'} alt={match.awayTeam} />
                </div>
                <span className="team-name">{match.awayTeam}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Results;