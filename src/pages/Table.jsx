import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Trophy, Loader2, Shield, Download } from 'lucide-react';
import { toJpeg } from 'html-to-image';

const Table = () => {
  const [leagueData, setLeagueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("Season 2");
  const tableRef = useRef(null);

  // Capped up to Season 4
  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4"];

  // Download JPEG Handler
  const downloadTable = async () => {
    if (tableRef.current === null) return;
    setDownloading(true);

    try {
      const dataUrl = await toJpeg(tableRef.current, { 
        quality: 0.95, 
        backgroundColor: '#04060d',
        cacheBust: true,
        style: { padding: '24px', borderRadius: '24px' }
      });

      const link = document.createElement('a');
      link.download = `St-Jerome-Standings-${selectedSeason}.jpg`;
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
    const generateTableData = async () => {
      setLoading(true);
      try {
        const clubsSnapshot = await getDocs(collection(db, "clubs"));
        const teamsMap = {};
        
        clubsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          teamsMap[data.name] = {
            id: doc.id,
            name: data.name,
            logo: data.logoUrl || data.logo || null,
            p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
          };
        });

        const fixturesQuery = query(
          collection(db, "fixtures"),
          where("season", "==", selectedSeason),
          where("status", "==", "completed")
        );
        const fixturesSnapshot = await getDocs(fixturesQuery);

        fixturesSnapshot.docs.forEach(doc => {
          const match = doc.data();
          const home = teamsMap[match.homeTeam];
          const away = teamsMap[match.awayTeam];

          if (home && away) {
            const hScore = Number(match.homeScore);
            const aScore = Number(match.awayScore);

            home.p += 1;
            away.p += 1;
            home.gf += hScore;
            home.ga += aScore;
            away.gf += aScore;
            away.ga += hScore;

            if (hScore > aScore) {
              home.w += 1; home.pts += 3;
              away.l += 1;
            } else if (hScore < aScore) {
              away.w += 1; away.pts += 3;
              home.l += 1;
            } else {
              home.d += 1; home.pts += 1;
              away.d += 1; away.pts += 1;
            }
            home.gd = home.gf - home.ga;
            away.gd = away.gf - away.ga;
          }
        });

        const sortedTeams = Object.values(teamsMap).sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          return b.gf - a.gf;
        });

        setLeagueData(sortedTeams.map((t, i) => ({ ...t, pos: i + 1 })));
      } catch (error) {
        console.error("Error calculating table:", error);
      } finally {
        setLoading(false);
      }
    };

    generateTableData();
  }, [selectedSeason]);

  return (
    <div className="table-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .table-page { 
          background-color: #04060d; 
          padding: 120px 5% 80px; 
          min-height: 100vh; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc;
          box-sizing: border-box;
        }
        .container { max-width: 1000px; margin: 0 auto; }
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
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .season-filter { 
          display: flex; 
          gap: 6px; 
          background: rgba(15, 23, 42, 0.8); 
          padding: 6px; 
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          margin: 0 auto;
        }

        .season-tab { 
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

        .season-tab:hover { color: #ffffff; }

        .season-tab.active { 
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
          justify-content: center;
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

        /* Table Card & Content */
        .table-card { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.4); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          padding: 10px;
        }
        
        table { width: 100%; border-collapse: collapse; }
        
        th { 
          background: rgba(4, 6, 13, 0.6); 
          padding: 16px 12px; 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: #64748b; 
          text-transform: uppercase; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
          letter-spacing: 1px;
        }
        
        td { 
          padding: 16px 12px; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.04); 
          font-weight: 600; 
          text-align: center; 
          color: #e2e8f0; 
          font-size: 0.9rem; 
        }
        
        tr:hover td { background: rgba(255, 255, 255, 0.02); }

        .w-pos { 
          width: 50px; 
          font-family: 'Bebas Neue', cursive; 
          font-size: 1.1rem; 
          color: #facc15; 
        }

        .w-team { text-align: left; padding-left: 15px; }

        .w-pts { 
          background: rgba(250, 204, 21, 0.08); 
          color: #facc15; 
          font-family: 'Bebas Neue', cursive; 
          font-size: 1.2rem;
          width: 70px; 
        }

        .col-team-cell { display: flex; align-items: center; gap: 12px; }
        
        /* Team Name: Unbolded */
        .team-name-text { 
          font-family: 'Bebas Neue', cursive;
          font-size: 1.25rem; 
          font-weight: 400; 
          color: #ffffff; 
          letter-spacing: 0.5px;
        }

        .team-logo-container { 
          width: 32px; 
          height: 32px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: #04060d; 
          border-radius: 10px; 
          border: 1px solid rgba(250, 204, 21, 0.2);
          flex-shrink: 0;
        }

        .team-logo { width: 20px; height: 20px; object-fit: contain; }
        
        tr.leader td { background: rgba(250, 204, 21, 0.03); }

        .legend { 
          display: flex; 
          justify-content: center; 
          gap: 18px; 
          margin-top: 25px; 
          padding: 16px; 
          background: rgba(15, 23, 42, 0.6); 
          border-radius: 18px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          flex-wrap: wrap;
          font-size: 0.75rem; 
          color: #94a3b8; 
          font-weight: 600;
        }

        .legend b { color: #facc15; }

        .export-header {
          text-align: center;
          padding-bottom: 20px;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(250, 204, 21, 0.2);
        }

        @media (max-width: 768px) {
          .table-page { padding-top: 100px; }
          .hide-mobile { display: none; }
          
          /* Hide logos on mobile screens */
          .hide-mobile-logo { display: none !important; }

          .action-bar { flex-direction: column; align-items: center; gap: 12px; }
          .download-btn { width: 100%; max-width: 300px; }
          td, th { padding: 12px 6px; font-size: 0.8rem; }
          .team-name-text { font-size: 0.95rem; }
          .w-team { padding-left: 5px; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <span className="header-tag">League Archives</span>
          <h1>LEAGUE <span className="gold-text">STANDINGS</span></h1>
          <p>Official performance table for {selectedSeason}</p>
        </header>

        <div className="action-bar">
          <div className="season-filter">
            {seasons.map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedSeason(s)} 
                className={`season-tab ${selectedSeason === s ? 'active' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button className="download-btn" onClick={downloadTable} disabled={downloading}>
            {downloading ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}
            SAVE AS JPG
          </button>
        </div>

        <div className="table-card" ref={tableRef}>
          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={40} color="#facc15" style={{ margin: 'auto' }}/>
              <p style={{ marginTop: '15px', fontWeight: 800, color: '#facc15', letterSpacing: '2px', fontSize: '0.8rem' }}>
                CALCULATING STANDINGS...
              </p>
            </div>
          ) : (
            <div>
              <div className="export-header" style={{ display: downloading ? 'block' : 'none' }}>
                <span style={{ fontFamily: 'Cinzel', color: '#facc15', fontSize: '0.8rem', letterSpacing: '2px', display: 'block' }}>ST. JEROME LEAGUE</span>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', color: '#ffffff', margin: '2px 0 0 0' }}>
                  {selectedSeason} — STANDINGS
                </h2>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th className="w-pos">Pos</th>
                      <th className="w-team">Club</th>
                      <th>P</th>
                      <th className="hide-mobile">W</th>
                      <th className="hide-mobile">D</th>
                      <th className="hide-mobile">L</th>
                      <th className="hide-mobile">GF</th>
                      <th className="hide-mobile">GA</th>
                      <th>GD</th>
                      <th className="w-pts">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueData.map((team) => (
                      <tr key={team.id} className={team.pos === 1 ? 'leader' : ''}>
                        <td className="w-pos">{team.pos}</td>
                        <td className="w-team">
                          <div className="col-team-cell">
                            {/* Logo hidden on mobile screens */}
                            <div className="team-logo-container hide-mobile-logo">
                              {team.logo ? (
                                <img src={team.logo} className="team-logo" crossOrigin="anonymous" alt=""/>
                              ) : (
                                <Shield size={14} color="#facc15"/>
                              )}
                            </div>
                            <span className="team-name-text">{team.name}</span>
                          </div>
                        </td>
                        <td>{team.p}</td>
                        <td className="hide-mobile">{team.w}</td>
                        <td className="hide-mobile">{team.d}</td>
                        <td className="hide-mobile">{team.l}</td>
                        <td className="hide-mobile">{team.gf}</td>
                        <td className="hide-mobile">{team.ga}</td>
                        <td style={{ color: team.gd > 0 ? '#10b981' : team.gd < 0 ? '#ef4444' : 'inherit' }}>
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>
                        <td className="w-pts">{team.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="legend">
          <span><b>P</b> Played</span>
          <span><b>W</b> Won</span>
          <span><b>D</b> Drawn</span>
          <span><b>L</b> Lost</span>
          <span><b>GD</b> Goal Difference</span>
          <span><b>Pts</b> Points</span>
        </div>
      </div>
    </div>
  );
};

export default Table;