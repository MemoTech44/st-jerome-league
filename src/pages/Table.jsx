import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Trophy, Loader2, Shield } from 'lucide-react';

const Table = () => {
  const [leagueData, setLeagueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("Season 2");

  // Capped up to Season 4
  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4"];

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

        // Check if any matches have been completed for this season
        const hasSeasonStarted = fixturesSnapshot.docs.length > 0;

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

        let sortedTeams = Object.values(teamsMap);

        if (!hasSeasonStarted) {
          // Default order: Alphabetical by team name if season hasn't started
          sortedTeams.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          // Standard league standings sorting order
          sortedTeams.sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.gd !== a.gd) return b.gd - a.gd;
            return b.gf - a.gf;
          });
        }

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
          padding: 120px 5% 40px; 
          min-height: 100vh; 
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

        /* Controls Section */
        .selector-wrapper { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          align-items: center; 
        }

        .season-filter { 
          display: flex; 
          gap: 6px; 
          background: rgba(15, 23, 42, 0.8); 
          padding: 6px; 
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .season-tab { 
          padding: 10px 22px; 
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

        /* Table Card & Content */
        .table-card { 
          background: rgba(15, 23, 42, 0.9); 
          backdrop-filter: blur(12px);
          border-radius: 18px; 
          overflow: hidden; 
          box-shadow: 0 8px 20px rgba(0,0,0,0.25); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        
        th { 
          background: rgba(4, 6, 13, 0.8); 
          padding: 12px 10px; 
          font-size: 0.7rem; 
          font-weight: 700; 
          color: #64748b; 
          text-transform: uppercase; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
          letter-spacing: 1px;
          text-align: center;
        }
        
        td { 
          padding: 12px 10px; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.04); 
          font-weight: 500; 
          text-align: center; 
          color: #e2e8f0; 
          font-size: 0.85rem; 
        }

        .w-pos { 
          width: 45px; 
          font-family: 'Bebas Neue', cursive; 
          font-size: 1.1rem; 
          color: #facc15; 
        }

        .w-team { text-align: left; padding-left: 10px; }

        .w-pts { 
          background: rgba(250, 204, 21, 0.08); 
          color: #facc15; 
          font-family: 'Bebas Neue', cursive; 
          font-size: 1.15rem; 
          width: 60px; 
        }

        .col-team-cell { display: flex; align-items: center; gap: 10px; }
        
        .team-name-text { 
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem; 
          font-weight: 600; 
          color: #f1f5f9; 
        }

        .team-logo-container { 
          width: 28px; 
          height: 28px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: #04060d; 
          border-radius: 8px; 
          border: 1px solid rgba(250, 204, 21, 0.2);
          flex-shrink: 0;
          padding: 3px;
        }

        .team-logo { max-width: 100%; max-height: 100%; object-fit: contain; }
        
        tr.leader td { background: rgba(250, 204, 21, 0.03); }

        .legend { 
          display: flex; 
          justify-content: center; 
          gap: 16px; 
          margin-top: 25px; 
          padding: 14px 20px; 
          background: rgba(15, 23, 42, 0.6); 
          border-radius: 18px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          flex-wrap: wrap;
          font-size: 0.75rem; 
          color: #94a3b8; 
          font-weight: 600;
        }

        .legend b { color: #facc15; }

        @media (max-width: 768px) {
          .table-page { padding-top: 90px; padding-left: 12px; padding-right: 12px; }
          .header-box { margin-bottom: 25px; }
          .header-box h1 { font-size: 2.4rem; margin-bottom: 15px; }
          
          .season-filter { padding: 4px; border-radius: 14px; gap: 4px; width: 100%; max-width: 340px; justify-content: space-between; }
          .season-tab { padding: 6px 10px; font-size: 0.65rem; border-radius: 10px; flex: 1; text-align: center; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <span className="header-tag">League Archives</span>
          <h1>LEAGUE <span className="gold-text">STANDINGS</span></h1>
          
          <div className="selector-wrapper">
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
          </div>
        </header>

        <div className="table-card">
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={40} color="#facc15" style={{ margin: 'auto' }}/>
              <p style={{ marginTop: '15px', fontWeight: 800, color: '#facc15', letterSpacing: '2px', fontSize: '0.8rem' }}>
                LOADING STANDINGS...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="w-pos">Pos</th>
                    <th className="w-team">Club</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
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
                      <td>{team.w}</td>
                      <td>{team.d}</td>
                      <td>{team.l}</td>
                      <td>{team.gf}</td>
                      <td>{team.ga}</td>
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
  );
};

export default Table;