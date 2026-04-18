import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Search, 
  Trophy, 
  User, 
  Loader2, 
  TrendingUp,
  ShieldCheck,
  UserX
} from 'lucide-react';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const q = query(collection(db, "players"), orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          goals: parseInt(doc.data().goals || 0),
          photo: doc.data().photoUrl || doc.data().photo || null 
        }));
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  useEffect(() => {
    let result = [...players];
    if (viewMode === 'scorers') {
      result = result.filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.team.toLowerCase().includes(term)
      );
    }
    setFilteredPlayers(result);
  }, [searchTerm, viewMode, players]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <Loader2 className="animate-spin" size={48} color="#1e40af" />
      <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b', fontFamily: 'Plus Jakarta Sans' }}>Loading Roster...</p>
    </div>
  );

  return (
    <div className="players-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .players-page { background: #f1f5f9; min-height: 100vh; padding: 140px 5% 60px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; }
        .container { max-width: 1000px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 50px; }
        .header-box h1 { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(2.5rem, 7vw, 4rem); 
          letter-spacing: -2px; 
          color: #1e40af; 
          margin-bottom: 15px;
          font-weight: 800;
        }
        .header-description {
          max-width: 700px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #64748b;
          font-weight: 500;
        }

        /* --- FIXED CONTROLS BAR --- */
        .controls-bar { 
          display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; align-items: center;
          background: white; padding: 20px 30px; border-radius: 30px;
          margin-bottom: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;
          box-sizing: border-box; /* Prevents overflow */
        }
        .search-box { position: relative; flex: 1; min-width: 280px; width: 100%; }
        .search-box input { 
          width: 100%; padding: 14px 14px 14px 50px; border-radius: 18px; 
          border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; font-family: inherit;
          box-sizing: border-box; /* Ensures padding doesn't push width out */
        }
        .search-box svg { position: absolute; left: 18px; top: 15px; color: #94a3b8; }

        .filter-group { display: flex; gap: 10px; }
        .toggle-btn { 
          padding: 12px 20px; border-radius: 15px; border: none; font-weight: 800; 
          cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;
          transition: 0.3s; white-space: nowrap;
        }

        .table-container { 
          background: white; border-radius: 40px; overflow: hidden; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; 
        }
        table { width: 100%; border-collapse: collapse; }
        th { 
          padding: 22px 25px; font-size: 0.75rem; text-transform: uppercase; 
          letter-spacing: 1.5px; font-weight: 800; color: #1e40af; 
          background: #f8fafc; text-align: left; border-bottom: 1px solid #e2e8f0;
        }
        td { padding: 18px 25px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #334155; cursor: pointer; }
        
        .player-name-cell { display: flex; align-items: center; gap: 12px; font-weight: 800; }
        .row-photo { width: 35px; height: 35px; border-radius: 10px; object-fit: cover; background: #eff6ff; }
        .team-tag { background: #eff6ff; color: #1e40af; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; }

        @media (max-width: 768px) {
          .controls-bar { flex-direction: column; align-items: stretch; }
          .filter-group { justify-content: center; }
          .toggle-btn { flex: 1; }
          .hide-mobile { display: none; }
        }

        /* --- MODAL --- */
        .modal-overlay { 
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
          background: rgba(15, 23, 42, 0.9); z-index: 10000; 
          display: flex; align-items: center; justify-content: center; 
          padding: 20px; backdrop-filter: blur(8px);
        }
        .modal-content { 
          background: white; width: 100%; max-width: 420px; border-radius: 45px; 
          overflow: hidden; position: relative; border-bottom: 8px solid #facc15;
          animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes modalPop { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-img { width: 100%; height: 300px; object-fit: cover; background: #0f172a; }
      `}</style>

      <div className="container">
        <header className="header-box">
          <h1>League Talent</h1>
          <p className="header-description">
            Discover the stars of the St. Jerome Alumni League. Use this register to find your teammates, check individual goal tallies, and view official player profiles from every registered club.
          </p>
        </header>

        <div className="controls-bar">
          <div className="search-box">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search by name or club..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button 
              className="toggle-btn" 
              onClick={() => setViewMode('all')} 
              style={{ background: viewMode === 'all' ? '#1e40af' : '#f1f5f9', color: viewMode === 'all' ? 'white' : '#64748b' }}
            >
              <User size={16} /> ALL
            </button>
            <button 
              className="toggle-btn" 
              onClick={() => setViewMode('scorers')} 
              style={{ background: viewMode === 'scorers' ? '#facc15' : '#f1f5f9', color: viewMode === 'scorers' ? '#0f172a' : '#64748b' }}
            >
              <Trophy size={16} /> SCORERS
            </button>
          </div>
        </div>

        <div className="table-container">
          {filteredPlayers.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
              <UserX size={50} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>No one is in the register</h3>
              <p style={{ color: '#94a3b8', fontWeight: 600 }}>Try checking the spelling or searching for a different club.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Club</th>
                  <th className="hide-mobile">Position</th>
                  <th style={{ textAlign: 'center' }}>Goals</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                    <td>
                      <div className="player-name-cell">
                        {player.photo ? (
                          <img src={player.photo} className="row-photo" alt="" />
                        ) : (
                          <div className="row-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} color="#cbd5e1" />
                          </div>
                        )}
                        {player.name}
                      </div>
                    </td>
                    <td><span className="team-tag">{player.team}</span></td>
                    <td className="hide-mobile" style={{ color: '#64748b' }}>{player.position}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: '#1e40af' }}>
                      {player.goals > 0 ? player.goals : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedPlayer && (
          <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              {selectedPlayer.photo ? (
                <img src={selectedPlayer.photo} className="modal-img" alt={selectedPlayer.name} />
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                  <User size={80} color="#cbd5e1" />
                </div>
              )}

              <div style={{ padding: '35px', textAlign: 'center' }}>
                <span style={{ color: '#1e40af', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {selectedPlayer.team}
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '5px 0' }}>{selectedPlayer.name}</h2>
                <p style={{ color: '#64748b', fontWeight: 700, marginBottom: '25px' }}>{selectedPlayer.position}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '22px', border: '1px solid #e2e8f0' }}>
                    <TrendingUp size={18} color="#1e40af" style={{ marginBottom: '5px' }} />
                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>SEASON GOALS</span>
                    <b style={{ fontSize: '1.5rem', color: '#1e40af' }}>{selectedPlayer.goals}</b>
                  </div>
                  <div style={{ background: '#fffbeb', padding: '18px', borderRadius: '22px', border: '1px solid #fef3c7' }}>
                    <ShieldCheck size={18} color="#b45309" style={{ marginBottom: '5px' }} />
                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#d97706' }}>VERIFIED</span>
                    <b style={{ fontSize: '1rem', color: '#92400e' }}>PLAYER</b>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPlayer(null)}
                  style={{ 
                    marginTop: '30px', width: '100%', padding: '16px', borderRadius: '18px', 
                    background: '#1e40af', color: 'white', border: 'none', fontWeight: 800, 
                    cursor: 'pointer', boxShadow: '0 8px 20px rgba(30, 64, 175, 0.2)' 
                  }}
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;