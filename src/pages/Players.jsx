import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Search, 
  Trophy, 
  User, 
  Loader2, 
  X,
  TrendingUp,
  Activity
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
          goals: parseInt(doc.data().goals || 0)
        }));
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (error) {
        console.error("Error:", error);
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
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlayers(result);
  }, [searchTerm, viewMode, players]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <Loader2 className="animate-spin" size={40} color="#1e40af" />
    </div>
  );

  return (
    <div className="players-page">
      <style>{`
        .players-page { background: #f1f5f9; min-height: 100vh; padding: 100px 5% 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1000px; margin: 0 auto; }
        
        /* Controls Bar - Responsive */
        .controls-bar { 
          display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: center;
          background: white; padding: 15px 25px; border-radius: 16px;
          margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .search-box { position: relative; flex: 1; min-width: 250px; max-width: 400px; }
        .search-box input { 
          width: 100%; padding: 10px 10px 10px 40px; border-radius: 10px; 
          border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; box-sizing: border-box;
        }
        .search-box svg { position: absolute; left: 12px; top: 11px; color: #94a3b8; }

        /* Table - Responsive Scroll */
        .table-container { background: white; border-radius: 20px; overflow-x: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        thead { background: #1e40af; color: white; }
        th { padding: 18px 25px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
        td { padding: 15px 25px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #334155; font-size: 0.9rem; cursor: pointer; }
        tr:hover td { background: #f8fafc; color: #1e40af; }

        /* Modal - Centered */
        .modal-overlay { 
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
          background: rgba(15, 23, 42, 0.7); z-index: 10000; 
          display: flex; align-items: center; justify-content: center; 
          padding: 20px; box-sizing: border-box; backdrop-filter: blur(4px);
        }
        .modal-content { 
          background: white; width: 100%; max-width: 400px; border-radius: 28px; 
          overflow: hidden; position: relative; 
          animation: popCenter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes popCenter { 
          from { transform: scale(0.9); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        
        .modal-photo { width: 100%; height: 280px; object-fit: cover; background: #f1f5f9; display: block; }
        .close-btn { position: absolute; top: 15px; right: 15px; background: white; border-radius: 50%; padding: 8px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: none; display: flex; z-index: 10; }
        
        .toggle-btn { padding: 10px 18px; border-radius: 8px; border: none; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.75rem; }

        @media (max-width: 600px) {
          .players-page { padding-top: 80px; }
          .search-box { max-width: 100%; }
          .controls-bar { flex-direction: column; align-items: stretch; }
          .toggle-btn { flex: 1; justify-content: center; }
        }
      `}</style>

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontWeight: 900, color: '#0f172a', fontSize: '2.2rem', margin: 0 }}>League <span style={{color: '#1e40af'}}>Talent</span></h1>
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Official St. Jerome League Player Roster</p>
        </div>

        <div className="controls-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search player or club..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="toggle-btn" onClick={() => setViewMode('all')} style={{ background: viewMode === 'all' ? '#1e40af' : '#f8fafc', color: viewMode === 'all' ? 'white' : '#64748b' }}>
              <User size={14} /> ALL
            </button>
            <button className="toggle-btn" onClick={() => setViewMode('scorers')} style={{ background: viewMode === 'scorers' ? '#facc15' : '#f8fafc', color: viewMode === 'scorers' ? '#0f172a' : '#64748b' }}>
              <Trophy size={14} /> SCORERS
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Club</th>
                <th>Position</th>
                <th style={{textAlign: 'center'}}>Goals</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map(player => (
                <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                  <td>{player.name}</td>
                  <td><span style={{color: '#1e40af'}}>{player.team}</span></td>
                  <td>{player.position}</td>
                  <td style={{textAlign: 'center'}}>
                    {player.goals > 0 ? <b style={{color: '#1e40af'}}>{player.goals}</b> : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Player Detail Modal - Public Info Only */}
        {selectedPlayer && (
          <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedPlayer(null)}><X size={18} /></button>
              
              {selectedPlayer.photoUrl ? (
                <img src={selectedPlayer.photoUrl} className="modal-photo" alt={selectedPlayer.name} />
              ) : (
                <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                  <User size={80} color="#cbd5e1" />
                </div>
              )}

              <div style={{ padding: '25px', textAlign: 'center' }}>
                <div style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '8px' }}>
                  {selectedPlayer.team}
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', textTransform: 'uppercase' }}>{selectedPlayer.name}</h2>
                <p style={{ color: '#64748b', fontWeight: 700, margin: '0 0 20px 0', fontSize: '0.9rem' }}>{selectedPlayer.position}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <TrendingUp size={16} color="#1e40af" style={{marginBottom: '5px'}} />
                    <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>TOTAL GOALS</span>
                    <b style={{ fontSize: '1.4rem', color: '#1e40af' }}>{selectedPlayer.goals}</b>
                  </div>
                  <div style={{ background: '#fffbeb', padding: '15px', borderRadius: '15px', border: '1px solid #fef3c7' }}>
                    <Activity size={16} color="#b45309" style={{marginBottom: '5px'}} />
                    <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: '#d97706', letterSpacing: '1px' }}>STATUS</span>
                    <b style={{ fontSize: '1rem', color: '#92400e' }}>VERIFIED</b>
                  </div>
                </div>
                
                <p style={{ marginTop: '20px', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  Official St. Jerome League Player Profile
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;