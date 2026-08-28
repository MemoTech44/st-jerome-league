import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { toJpeg } from 'html-to-image';
import { 
  MapPin, 
  Loader2, 
  Download,
  LayoutGrid,
  Trophy
} from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  const [selectedSeason, setSelectedSeason] = useState("Season 2");
  const [selectedMatchday, setSelectedMatchday] = useState('All');
  const [availableMatchdays, setAvailableMatchdays] = useState([]);

  const resultsRef = useRef(null);

  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4"];

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
          const data = doc.data();
          logos[data.name] = data.logoUrl || data.logo;
        });
        setTeamLogos(logos);

        // Fetch completed fixtures for the selected season, ordering by date and time
        const q = query(
          collection(db, "fixtures"), 
          where("status", "==", "completed"),
          where("season", "==", selectedSeason),
          orderBy("date", "desc"),
          orderBy("time", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        const matchData = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));

        // Dynamically extract available completed matchdays (supports numeric rounds and text like Gala)
        const mdays = [...new Set(matchData.map(m => m.matchday))].sort((a, b) => {
          const numA = Number(a);
          const numB = Number(b);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return String(a).localeCompare(String(b));
        });

        setAvailableMatchdays(mdays);
        setResults(matchData);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultsData();
  }, [selectedSeason]);

  const filteredResults = selectedMatchday === 'All'
    ? results
    : results.filter(m => String(m.matchday) === String(selectedMatchday));

  const groupedByMatchday = filteredResults.reduce((acc, match) => {
    const md = match.matchday;
    if (!acc[md]) acc[md] = [];
    acc[md].push(match);
    return acc;
  }, {});

  return (
    <div className="results-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .results-page { 
          background: #04060d; 
          min-height: 100vh; 
          padding: 120px 5% 40px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .container { max-width: 920px; margin: 0 auto; width: 100%; }
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

        /* Download Action Bar */
        .action-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 25px;
        }

        .download-btn {
          background: rgba(250, 204, 21, 0.1);
          color: #facc15;
          border: 1px solid rgba(250, 204, 21, 0.3);
          padding: 10px 20px;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .download-btn:hover:not(:disabled) {
          background: #facc15;
          color: #04060d;
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.25);
        }

        .download-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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

        /* Result Cards */
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

        .score-val { 
          font-family: 'Bebas Neue', cursive;
          font-size: 1.35rem; 
          color: #facc15; 
          letter-spacing: 0.8px; 
          line-height: 1;
        }

        .ft-tag { 
          font-size: 0.55rem; 
          font-weight: 900; 
          color: #64748b; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
        }

        .export-header {
          text-align: center;
          padding-bottom: 20px;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(250, 204, 21, 0.2);
        }

        @media (max-width: 768px) {
          .results-page { padding-top: 90px; padding-left: 12px; padding-right: 12px; }
          .header-box { margin-bottom: 25px; }
          .header-box h1 { font-size: 2.4rem; margin-bottom: 15px; }
          
          .season-selector { padding: 4px; border-radius: 14px; gap: 4px; width: 100%; max-width: 340px; justify-content: space-between; }
          .season-pill { padding: 6px 10px; font-size: 0.65rem; border-radius: 10px; flex: 1; text-align: center; }

          .filter-btn { padding: 6px 12px; font-size: 0.7rem; border-radius: 10px; }

          .match-card { grid-template-columns: 1fr 55px 1fr; padding: 10px 8px; border-radius: 14px; margin-bottom: 8px; }
          .team { gap: 6px; }
          .team-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 0.75rem; line-height: 1.2; letter-spacing: normal; color: #f1f5f9; }
          .logo-frame { width: 24px; height: 24px; border-radius: 8px; padding: 3px; }
          .score-val { font-size: 0.95rem; }
          .ft-tag { font-size: 0.5rem; }
          .md-meta { font-size: 0.7rem; gap: 8px; flex-wrap: wrap; }
          .md-badge { padding: 6px 16px; font-size: 0.7rem; }
          .action-bar { justify-content: center; }
          .download-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <span className="header-tag">League Archives</span>
          <h1>MATCH <span className="gold-text">RESULTS</span></h1>
          
          <div className="selector-wrapper">
            <div className="season-selector">
              {seasons.map(s => (
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
                <LayoutGrid size={13} style={{ marginRight: '6px' }}/> Full Archive
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

        {results.length > 0 && (
          <div className="action-bar">
            <button className="download-btn" onClick={downloadResults} disabled={downloading}>
              {downloading ? <Loader2 className="animate-spin" size={15}/> : <Download size={15}/>}
              SAVE AS JPG
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ height: '30vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={48} color="#facc15" />
            <p style={{ marginTop: '20px', fontWeight: 800, color: '#facc15', letterSpacing: '2px', fontSize: '0.85rem' }}>
              FETCHING ARCHIVES...
            </p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Trophy size={48} className="gold-text" style={{ marginBottom: '15px' }}/>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: '#ffffff', margin: '0 0 5px 0' }}>No Records Found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No results have been uploaded for {selectedSeason}.</p>
          </div>
        ) : (
          <div ref={resultsRef}>
            {downloading && (
              <div className="export-header">
                <span style={{ fontFamily: 'Cinzel', color: '#facc15', fontSize: '0.8rem', letterSpacing: '2px', display: 'block' }}>ST. JEROME LEAGUE</span>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', color: '#ffffff', margin: '2px 0 0 0' }}>
                  {selectedSeason} {selectedMatchday !== 'All' ? `— Matchday ${selectedMatchday}` : '— All Results'}
                </h2>
              </div>
            )}

            {Object.keys(groupedByMatchday).sort((a, b) => {
              const numA = Number(a);
              const numB = Number(b);
              if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
              return String(a).localeCompare(String(b));
            }).map(md => (
              <div key={md} className="md-section">
                <div className="md-header">
                  <span className="md-badge">{isNaN(md) ? md : `Matchday ${md}`}</span>
                  <div className="md-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} color="#facc15"/> {groupedByMatchday[md][0].venue || "Arena"}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Trophy size={15} color="#facc15"/> {groupedByMatchday[md][0].date}</span>
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
                          crossOrigin="anonymous"
                          alt={match.homeTeam} 
                          className="logo-img" 
                        />
                      </div>
                    </div>

                    {/* SCORE DIVIDER */}
                    <div className="center-divider">
                      <span className="ft-tag">FT</span>
                      <span className="score-val">{match.homeScore} - {match.awayScore}</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;