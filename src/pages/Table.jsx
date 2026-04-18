import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Trophy, Loader2, Shield, Download } from 'lucide-react';
import { toJpeg } from 'html-to-image'; // Import the library

const Table = () => {
  const [leagueData, setLeagueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("Season 2");
  const tableRef = useRef(null); // Reference for the table capture

  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5"];

  // Function to handle the download
  const downloadTable = () => {
    if (tableRef.current === null) return;

    // Use toJpeg to capture the element
    toJpeg(tableRef.current, { 
      quality: 0.95, 
      backgroundColor: '#ffffff',
      style: { borderRadius: '0px' } // Prevents rounded corners cutting off in the image
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `St-Jerome-Standings-${selectedSeason}.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Download failed', err);
      });
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        
        .table-page { 
          background-color: #f8fafc; 
          padding: 140px 5% 80px; 
          min-height: 100vh; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #1e293b;
        }
        .container { max-width: 1100px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 40px; }
        .header-box h1 { 
          font-size: clamp(2.2rem, 5vw, 3rem); 
          font-weight: 800; 
          color: #1e3a8a; 
          margin: 0;
          letter-spacing: -1px;
        }
        .header-underline {
          width: 50px;
          height: 5px;
          background: #facc15;
          margin: 15px auto;
          border-radius: 10px;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1e3a8a;
          color: #facc15;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .download-btn:hover { background: #162e70; transform: translateY(-2px); }
        
        .season-filter { 
          display: flex; gap: 8px; 
          background: #f1f5f9; padding: 6px; border-radius: 16px;
          border: 1px solid #e2e8f0;
        }
        .season-tab { 
          padding: 10px 20px; border-radius: 12px; border: none; background: transparent; 
          color: #64748b; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.3s;
        }
        .season-tab.active { background: #1e3a8a; color: #facc15; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15); }

        .table-card { 
          background: white; 
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05); 
          border: 1px solid #e2e8f0; 
        }
        
        table { width: 100%; border-collapse: collapse; }
        th { 
          background: #f8fafc; 
          padding: 18px 10px; 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: #64748b; 
          text-transform: uppercase; 
          border-bottom: 2px solid #f1f5f9; 
        }
        
        td { 
          padding: 18px 10px; 
          border-bottom: 1px solid #f1f5f9; 
          font-weight: 700; 
          text-align: center; 
          color: #1e293b; 
          font-size: 0.95rem; 
        }
        
        .w-pos { width: 60px; color: #64748b; }
        .w-team { text-align: left; padding-left: 20px; }
        .w-pts { background: #eff6ff; color: #1e3a8a; font-weight: 800; width: 80px; }

        .col-team-cell { display: flex; align-items: center; gap: 14px; }
        .team-logo-container { 
          width: 32px; height: 32px; 
          display: flex; align-items: center; justify-content: center; 
          background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;
        }
        .team-logo { width: 22px; height: 22px; object-fit: contain; }
        
        tr.leader { background: #fffdf5; }
        .legend { 
          display: flex; justify-content: center; gap: 20px; margin-top: 30px; padding: 20px; 
          background: white; border-radius: 16px; border: 1px solid #e2e8f0; flex-wrap: wrap;
          font-size: 0.75rem; color: #64748b; font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .action-bar { justify-content: center; }
        }
      `}</style>

      <div className="table-page">
        <div className="container">
          <div className="header-box">
            <h1>League Table</h1>
            <div className="header-underline"></div>
            <p>Official standings for the St. Jerome Alumni League.</p>
          </div>

          <div className="action-bar">
            <div className="season-filter">
              {seasons.map(s => (
                <button key={s} onClick={() => setSelectedSeason(s)} className={`season-tab ${selectedSeason === s ? 'active' : ''}`}>
                  {s}
                </button>
              ))}
            </div>

            <button className="download-btn" onClick={downloadTable}>
              <Download size={18} /> DOWNLOAD JPG
            </button>
          </div>

          <div className="table-card" ref={tableRef}>
            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="#1e3a8a" style={{margin:'auto'}}/>
              </div>
            ) : (
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
                            <div className="team-logo-container">
                              {team.logo ? <img src={team.logo} className="team-logo" alt=""/> : <Shield size={16} color="#cbd5e1"/>}
                            </div>
                            <span>{team.name}</span>
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
    </>
  );
};

export default Table;