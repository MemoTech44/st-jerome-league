import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { toJpeg } from 'html-to-image';
import { 
  MapPin, 
  Loader2, 
  Trophy,
  History,
  Download
} from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  const [selectedSeason, setSelectedSeason] = useState("Season 2");
  const [selectedMatchday, setSelectedMatchday] = useState(1);

  const resultsRef = useRef(null); // Ref for capturing the image

  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5"];
  const matchdays = Array.from({ length: 12 }, (_, i) => i + 1);

  // Download Logic
  const downloadResults = async () => {
    if (resultsRef.current === null) return;
    setDownloading(true);
    
    try {
      const dataUrl = await toJpeg(resultsRef.current, { 
        quality: 0.95, 
        backgroundColor: '#f8fafc',
        cacheBust: true,
        style: { padding: '20px' } // Add some padding to the exported image
      });

      const link = document.createElement('a');
      link.download = `St-Jerome-${selectedSeason}-MD${selectedMatchday}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert("Failed to generate image. Please check your connection.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchResultsData = async () => {
      setLoading(true);
      try {
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const logos = {};
        teamsSnapshot.docs.forEach(doc => {
          logos[doc.data().name] = doc.data().logoUrl || doc.data().logo;
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
        .container { max-width: 800px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 40px; }
        .header-box h1 { 
          font-size: clamp(2.2rem, 5vw, 3rem); 
          font-weight: 800; 
          color: #1e3a8a; 
          letter-spacing: -1px;
          margin: 0;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .download-btn {
          background: #1e3a8a;
          color: #facc15;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          transition: 0.3s;
        }

        .download-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .season-tabs { 
          display: flex; gap: 8px; 
          background: #f1f5f9; padding: 6px; border-radius: 16px;
        }
        .season-btn { 
          padding: 10px 15px; border-radius: 12px; border: none; background: transparent; 
          color: #64748b; font-weight: 700; font-size: 0.75rem; cursor: pointer;
        }
        .season-btn.active { background: #1e3a8a; color: #facc15; }

        .md-scroll { 
          display: flex; gap: 12px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 30px;
          scrollbar-width: none;
        }
        .md-pill { 
          padding: 10px 22px; border-radius: 14px; border: 1px solid #e2e8f0; background: white; 
          color: #1e3a8a; font-weight: 800; cursor: pointer; white-space: nowrap; font-size: 0.8rem;
        }
        .md-pill.active { background: #1e3a8a; color: #facc15; border-color: #1e3a8a; }

        .result-card { 
          background: white; border-radius: 20px; padding: 25px; margin-bottom: 15px;
          display: grid; grid-template-columns: 1fr 140px 1fr; align-items: center;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .team-info { display: flex; align-items: center; gap: 15px; }
        .team-info.home { justify-content: flex-end; text-align: right; }
        .team-name { font-weight: 800; color: #1e293b; font-size: 1rem; }
        
        .logo-box { 
          width: 48px; height: 48px; background: #f8fafc; border-radius: 12px; 
          padding: 6px; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center;
        }
        .logo-box img { width: 100%; height: 100%; object-fit: contain; }

        .score-center { text-align: center; }
        .score-box { 
          background: #1e3a8a; color: #facc15; font-size: 1.8rem; font-weight: 800; 
          padding: 6px 20px; border-radius: 14px; display: inline-flex; gap: 10px;
        }
        
        .venue-tag { margin-top: 8px; font-size: 0.7rem; color: #94a3b8; font-weight: 700; }

        @media (max-width: 600px) {
          .result-card { grid-template-columns: 1fr; gap: 15px; }
          .team-info.home { flex-direction: column-reverse; text-align: center; }
          .team-info { flex-direction: column; text-align: center; }
          .action-bar { flex-direction: column; gap: 15px; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <h1>Match Archives</h1>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Official results for {selectedSeason}</p>
        </header>

        <div className="filter-section">
          <div className="action-bar">
            <div className="season-tabs">
              {seasons.map(s => (
                <button 
                  key={s} 
                  className={`season-btn ${selectedSeason === s ? 'active' : ''}`}
                  onClick={() => setSelectedSeason(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            
            {results.length > 0 && (
              <button className="download-btn" onClick={downloadResults} disabled={downloading}>
                {downloading ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}
                SAVE AS JPG
              </button>
            )}
          </div>

          <div className="md-scroll">
            {matchdays.map(m => (
              <button 
                key={m} 
                className={`md-pill ${selectedMatchday === m ? 'active' : ''}`}
                onClick={() => setSelectedMatchday(m)}
              >
                MD {m}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={40} color="#1e3a8a" style={{margin: '0 auto'}}/>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px' }}>
            <History size={40} color="#cbd5e1" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>No results found for this matchday.</p>
          </div>
        ) : (
          /* The Ref is here to capture only the results list */
          <div ref={resultsRef}>
             {/* Header included in export */}
             <div className="export-header" style={{ display: 'none' }}>
                <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>{selectedSeason} - Matchday {selectedMatchday}</h2>
             </div>
             
             {results.map((match) => (
              <div key={match.id} className="result-card">
                <div className="team-info home">
                  <span className="team-name">{match.homeTeam}</span>
                  <div className="logo-box">
                    <img 
                      src={teamLogos[match.homeTeam] || '/placeholder.png'} 
                      crossOrigin="anonymous" 
                      alt="" 
                    />
                  </div>
                </div>

                <div className="score-center">
                  <div className="score-box">
                    <span>{match.homeScore}</span>
                    <span style={{ opacity: 0.2 }}>|</span>
                    <span>{match.awayScore}</span>
                  </div>
                  <div className="venue-tag">
                    <MapPin size={10} /> {match.venue || "Arena"}
                  </div>
                </div>

                <div className="team-info">
                  <div className="logo-box">
                    <img 
                      src={teamLogos[match.awayTeam] || '/placeholder.png'} 
                      crossOrigin="anonymous" 
                      alt="" 
                    />
                  </div>
                  <span className="team-name">{match.awayTeam}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;