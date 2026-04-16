import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Trophy, Loader2, AlertCircle, Info, Shield } from 'lucide-react';

const Table = () => {
  const [leagueData, setLeagueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const teams = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unknown Team",
            logo: data.logoUrl || data.logo || null,
            p: parseInt(data.played || 0),
            w: parseInt(data.won || 0),
            d: parseInt(data.drawn || 0),
            l: parseInt(data.lost || 0),
            gf: parseInt(data.gf || 0),
            ga: parseInt(data.ga || 0),
            gd: parseInt(data.gd || 0),
            pts: parseInt(data.pts || 0)
          };
        });

        const sortedTeams = teams.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          return b.gf - a.gf;
        });

        setLeagueData(sortedTeams.map((t, i) => ({ ...t, pos: i + 1 })));
      } catch (error) {
        console.error("Error fetching table:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTable();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <Loader2 className="animate-spin" size={40} color="#1e40af" />
        <p style={{ marginTop: '15px', fontWeight: 700, color: '#64748b' }}>Updating Standings...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .table-page { background-color: #f1f5f9; padding: 100px 15px 60px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1100px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 40px; }
        .header-box h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: #0f172a; letter-spacing: -1.5px; margin: 0; }
        
        .table-card { 
          background: white; 
          border-radius: 20px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); 
          border: 1px solid #e2e8f0; 
        }

        .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table { width: 100%; border-collapse: collapse; min-width: 600px; }

        th { 
          background: #f8fafc; 
          padding: 16px 12px; 
          text-align: center; 
          font-size: 0.65rem; 
          font-weight: 800; 
          color: #64748b; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
          border-bottom: 2px solid #f1f5f9;
        }

        td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-weight: 600; text-align: center; color: #334155; font-size: 0.9rem; }
        
        /* STICKY COLUMN LOGIC */
        .col-pos { width: 50px; font-weight: 800; color: #94a3b8; }
        .col-team { 
          text-align: left; 
          min-width: 180px; 
          font-weight: 800; 
          color: #0f172a; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          position: sticky; 
          left: 0; 
          background: white;
          z-index: 10;
        }
        
        /* Add a shadow effect when scrolling to indicate the sticky column */
        .table-wrap:scroll .col-team {
           box-shadow: 4px 0 8px -4px rgba(0,0,0,0.1);
        }

        .team-logo-container {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          flex-shrink: 0;
        }

        .team-logo { width: 100%; height: 100%; object-fit: contain; padding: 3px; }

        .col-pts { background: #eff6ff; color: #1e40af; font-weight: 800; border-left: 1px solid #dbeafe; }
        
        tr.top-rank { border-left: 4px solid #1e40af; }
        tr.leader { border-left: 4px solid #facc15; }

        .legend { 
          display: flex; 
          justify-content: center; 
          gap: 15px; 
          margin-top: 25px; 
          flex-wrap: wrap; 
          background: white; 
          padding: 12px; 
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-size: 0.7rem;
          color: #64748b;
        }

        /* MOBILE ADJUSTMENTS */
        @media (max-width: 640px) {
          .hide-mobile { display: none; }
          .col-team { min-width: 150px; font-size: 0.8rem; }
          td, th { padding: 12px 8px; }
          .header-box { margin-bottom: 25px; }
        }
      `}</style>

      <div className="table-page">
        <div className="container">
          <div className="header-box">
            <h1>League <span style={{color: '#1e40af'}}>Standings</span></h1>
            <p style={{color: '#64748b', fontWeight: 600, fontSize: '0.9rem'}}>Official Season 2026</p>
          </div>

          <div className="table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th className="col-pos">#</th>
                    <th style={{ textAlign: 'left', position: 'sticky', left: 0, background: '#f8fafc', zIndex: 11 }}>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th className="hide-mobile">GF</th>
                    <th className="hide-mobile">GA</th>
                    <th>GD</th>
                    <th className="col-pts">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueData.map((team) => (
                    <tr key={team.id} className={team.pos === 1 ? 'leader' : team.pos <= 3 ? 'top-rank' : ''}>
                      <td className="col-pos">{team.pos}</td>
                      <td className="col-team">
                        <div className="team-logo-container">
                          {team.logo ? (
                            <img src={team.logo} alt="" className="team-logo" />
                          ) : (
                            <Shield size={16} color="#cbd5e1" />
                          )}
                        </div>
                        <span style={{ whiteSpace: 'nowrap' }}>{team.name}</span>
                      </td>
                      <td>{team.p}</td>
                      <td>{team.w}</td>
                      <td>{team.d}</td>
                      <td>{team.l}</td>
                      <td className="hide-mobile" style={{ color: '#059669' }}>{team.gf}</td>
                      <td className="hide-mobile" style={{ color: '#dc2626' }}>{team.ga}</td>
                      <td style={{ fontWeight: 800 }}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                      <td className="col-pts">{team.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="legend">
            <span><b>P</b>: Played</span>
            <span><b>W</b>: Won</span>
            <span className="hide-mobile"><b>D</b>: Drew</span>
            <span className="hide-mobile"><b>L</b>: Lost</span>
            <span className="hide-mobile"><b>GD</b>: Goal Difference</span>
            <span style={{ color: '#1e40af' }}><b>PTS</b>: Points</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;