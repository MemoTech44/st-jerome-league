import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { toJpeg } from 'html-to-image';
import { 
  MapPin, 
  Loader2, 
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

  const resultsRef = useRef(null);

  // Updated to 4 Seasons and 4 Matchdays
  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4"];
  const matchdays = [1, 2, 3, 4];

  // Download Logic
  const downloadResults = async () => {
    if (resultsRef.current === null) return;
    setDownloading(true);
    
    try {
      const dataUrl = await toJpeg(resultsRef.current, { 
        quality: 0.95, 
        backgroundColor: '#04060d',
        cacheBust: true,
        style: { padding: '24px', borderRadius: '24px' }
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .results-page { 
          background: #04060d; 
          min-height: 100vh; 
          padding: 120px 5% 80px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc;
          box-sizing: border-box;
        }

        .container { max-width: 920px; margin: 0 auto; }
        .gold-text { color: #facc15; }
        
        /* Header Box */
        .header-box { text-align: center; margin-bottom: 40px; }

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
          margin: 0 0 6px 0; 
          line-height: 1;
        }

        .header-box p {
          color: #94a3b8;
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
        }

        /* Controls Section */
        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .season-tabs { 
          display: flex; 
          gap: 6px; 
          background: rgba(15, 23, 42, 0.8); 
          padding: 6px; 
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .season-btn { 
          padding: 10px 18px; 
          border-radius: 14px; 
          border: none; 
          background: transparent; 
          color: #94a3b8; 
          font-weight: 800; 
          font-size: 0.75rem; 
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .season-btn:hover { color: #ffffff; }

        .season-btn.active { 
          background: #facc15; 
          color: #04060d; 
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.25);
        }

        .download-btn {
          background: rgba(250, 204, 21, 0.1);
          color: #facc15;
          border: 1px solid rgba(250, 204, 21, 0.3);
          padding: 11px 20px;
          border-radius: 16px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .download-btn:hover:not(:disabled) {
          background: #facc15;
          color: #04060d;
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.25);
        }

        .download-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Matchday Horizontal Scroll */
        .md-scroll { 
          display: flex; 
          gap: 10px; 
          overflow-x: auto; 
          padding-bottom: 15px; 
          margin-bottom: 30px;
          scrollbar-width: none;
        }

        .md-scroll::-webkit-scrollbar { display: none; }

        .md-pill { 
          padding: 10px 22px; 
          border-radius: 14px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          background: rgba(15, 23, 42, 0.6); 
          color: #94a3b8; 
          font-weight: 800; 
          cursor: pointer; 
          white-space: nowrap; 
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .md-pill:hover {
          border-color: rgba(250, 204, 21, 0.4);
          color: #ffffff;
        }

        .md-pill.active { 
          background: rgba(250, 204, 21, 0.12); 
          color: #facc15; 
          border-color: rgba(250, 204, 21, 0.4); 
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.1); 
        }

        /* Result Cards - Styled to match Fixtures single-line layout */
        .result-card { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          border-radius: 24px; 
          padding: 22px 35px; 
          margin-bottom: 12px;
          display: grid; 
          grid-template-columns: 1fr 110px 1fr; 
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .result-card:hover {
          transform: translateY(-2px);
          border-color: rgba(250, 204, 21, 0.3);
          box-shadow: 0 12px 35px rgba(0,0,0,0.5);
        }

        .team { display: flex; align-items: center; gap: 18px; }
        .team.home { justify-content: flex-end; text-align: right; }
        .team.away { justify-content: flex-start; text-align: left; }
        
        .team-name { 
          font-family: 'Bebas Neue', cursive;
          font-size: 1.4rem; 
          color: #ffffff; 
          letter-spacing: 1px;
        }
        
        .logo-frame { 
          width: 54px; 
          height: 54px; 
          background: #04060d; 
          border-radius: 16px; 
          padding: 8px; 
          border: 1px solid rgba(250, 204, 21, 0.2); 
          display: flex; 
          align-items: center; 
          justify-content: center;
          flex-shrink: 0;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }

        .logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .center-divider { 
          text-align: center; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 4px; 
          padding: 0 10px;
          border-left: 1px solid rgba(255, 255, 255, 0.06); 
          border-right: 1px solid rgba(255, 255, 255, 0.06); 
        }

        .score-val { 
          font-family: 'Bebas Neue', cursive;
          font-size: 1.6rem; 
          color: #facc15; 
          letter-spacing: 1px; 
          line-height: 1;
        }

        .venue-tag { 
          font-size: 0.65rem; 
          font-weight: 800; 
          color: #64748b; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .export-header {
          text-align: center;
          padding-bottom: 20px;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(250, 204, 21, 0.2);
        }

        @media (max-width: 768px) {
          .results-page { padding-top: 100px; }
          .result-card { grid-template-columns: 1fr 75px 1fr; padding: 18px 12px; border-radius: 20px; }
          .team { gap: 10px; }
          .team-name { font-size: 1rem; line-height: 1.1; }
          .logo-frame { width: 40px; height: 40px; border-radius: 12px; padding: 6px; }
          .score-val { font-size: 1.2rem; }
          .action-bar { flex-direction: column; align-items: stretch; gap: 12px; }
          .season-tabs { justify-content: center; }
          .download-btn { justify-content: center; width: 100%; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <span className="header-tag">League Archives</span>
          <h1>MATCH <span className="gold-text">RESULTS</span></h1>
          <p>Official match performance summary for {selectedSeason}</p>
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
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <Loader2 className="animate-spin" size={44} color="#facc15" style={{ margin: '0 auto' }}/>
            <p style={{ marginTop: '20px', fontWeight: 800, color: '#facc15', letterSpacing: '2px', fontSize: '0.85rem' }}>
              FETCHING ARCHIVES...
            </p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <History size={48} className="gold-text" style={{ marginBottom: '15px' }} />
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: '#ffffff', margin: '0 0 5px 0' }}>No Records Found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No completed results found for this matchday.</p>
          </div>
        ) : (
          /* Captured element ref for JPEG export */
          <div ref={resultsRef}>
             <div className="export-header" style={{ display: downloading ? 'block' : 'none' }}>
                <span style={{ fontFamily: 'Cinzel', color: '#facc15', fontSize: '0.8rem', letterSpacing: '2px', display: 'block' }}>ST. JEROME LEAGUE</span>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', color: '#ffffff', margin: '2px 0 0 0' }}>
                  {selectedSeason} — MATCHDAY {selectedMatchday}
                </h2>
             </div>
             
             {results.map((match) => (
              <div key={match.id} className="result-card">
                {/* HOME */}
                <div className="team home">
                  <span className="team-name">{match.homeTeam}</span>
                  <div className="logo-frame">
                    <img 
                      src={teamLogos[match.homeTeam] || `https://ui-avatars.com/api/?name=${match.homeTeam}&background=0f172a&color=facc15`} 
                      crossOrigin="anonymous" 
                      alt={match.homeTeam} 
                      className="logo-img"
                    />
                  </div>
                </div>

                {/* SCORE DIVIDER */}
                <div className="center-divider">
                  <span className="score-val">{match.homeScore} - {match.awayScore}</span>
                  <div className="venue-tag">
                    <MapPin size={10} color="#facc15" /> {match.venue || "Arena"}
                  </div>
                </div>

                {/* AWAY */}
                <div className="team away">
                  <div className="logo-frame">
                    <img 
                      src={teamLogos[match.awayTeam] || `https://ui-avatars.com/api/?name=${match.awayTeam}&background=0f172a&color=facc15`} 
                      crossOrigin="anonymous" 
                      alt={match.awayTeam} 
                      className="logo-img"
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