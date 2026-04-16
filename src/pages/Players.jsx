import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Search, 
  Filter, 
  Trophy, 
  User, 
  Loader2, 
  Shield, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'scorers'

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const q = query(collection(db, "players"), orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.name || doc.data().name,
          team: doc.team || doc.data().team,
          position: doc.position || doc.data().position,
          goals: parseInt(doc.data().goals || 0),
          photoUrl: doc.data().photoUrl || null
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

  // Handle Filtering & Searching
  useEffect(() => {
    let result = [...players];

    // Filter by Top Scorers
    if (viewMode === 'scorers') {
      result = result.filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals);
    }

    // Filter by Search Term
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPlayers(result);
  }, [searchTerm, viewMode, players]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <Loader2 className="animate-spin" size={40} color="#1e40af" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        .players-page { background: #f1f5f9; min-height: 100vh; padding: 120px 5% 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1100px; margin: 0 auto; }
        
        .page-header { margin-bottom: 40px; text-align: center; }
        .page-header h1 { font-size: 3rem; font-weight: 900; color: #0f172a; letter-spacing: -2px; }

        .controls-bar { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 20px; 
          margin-bottom: 30px; 
          background: white; 
          padding: 20px; 
          border-radius: 20px; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          align-items: center;
          justify-content: space-between;
        }

        .search-box { 
          position: relative; 
          flex: 1; 
          min-width: 280px; 
        }
        .search-box input { 
          width: 100%; 
          padding: 12px 12px 12px 45px; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0; 
          background: #f8fafc;
          font-weight: 600;
        }
        .search-box svg { position: absolute; left: 15px; top: 13px; color: #94a3b8; }

        .toggle-btns { display: flex; gap: 10px; }
        .toggle-btn { 
          padding: 10px 20px; 
          border-radius: 10px; 
          border: none; 
          font-weight: 800; 
          cursor: pointer; 
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .player-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
          gap: 25px; 
        }

        .player-card { 
          background: white; 
          border-radius: 24px; 
          overflow: hidden; 
          border: 1px solid #e2e8f0; 
          transition: 0.3s; 
          position: relative;
        }
        .player-card:hover { transform: translateY(-5px); border-color: #1e40af; }

        .player-photo-container { 
          width: 100%; 
          aspect-ratio: 1/1; 
          background: #f8fafc; 
          overflow: hidden; 
        }
        .player-img { width: 100%; height: 100%; object-fit: cover; }
        
        .goal-badge { 
          position: absolute; 
          top: 15px; 
          right: 15px; 
          background: #facc15; 
          color: #0f172a; 
          padding: 5px 12px; 
          border-radius: 12px; 
          font-weight: 900; 
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .player-info { padding: 20px; text-align: center; }
        .player-name { font-weight: 800; font-size: 1.1rem; color: #0f172a; margin-bottom: 5px; text-transform: uppercase; }
        .player-team { font-size: 0.75rem; font-weight: 700; color: #1e40af; background: #eff6ff; padding: 4px 12px; border-radius: 20px; display: inline-block; }
        .player-pos { font-size: 0.8rem; color: #64748b; margin-top: 10px; font-weight: 600; display: block; }
      `}</style>

      <div className="players-page">
        <div className="container">
          
          <div className="page-header">
            <h1>League <span style={{color: '#1e40af'}}>Talent</span></h1>
            <p style={{color: '#64748b', fontWeight: 600}}>Discover the stars of the St. Jerome League</p>
          </div>

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

            <div className="toggle-btns">
              <button 
                className="toggle-btn" 
                onClick={() => setViewMode('all')}
                style={{
                  background: viewMode === 'all' ? '#1e40af' : '#f8fafc',
                  color: viewMode === 'all' ? 'white' : '#64748b'
                }}
              >
                <User size={16} /> ALL PLAYERS
              </button>
              <button 
                className="toggle-btn" 
                onClick={() => setViewMode('scorers')}
                style={{
                  background: viewMode === 'scorers' ? '#facc15' : '#f8fafc',
                  color: viewMode === 'scorers' ? '#0f172a' : '#64748b'
                }}
              >
                <Trophy size={16} /> TOP SCORERS
              </button>
            </div>
          </div>

          <div className="player-grid">
            {filteredPlayers.map(player => (
              <div key={player.id} className="player-card">
                {player.goals > 0 && (
                  <div className="goal-badge">
                    <TrendingUp size={12} /> {player.goals} GOALS
                  </div>
                )}
                
                <div className="player-photo-container">
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} className="player-img" />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={80} color="#cbd5e1" />
                    </div>
                  )}
                </div>

                <div className="player-info">
                  <span className="player-team">{player.team}</span>
                  <div className="player-name">{player.name}</div>
                  <span className="player-pos">{player.position}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
              <Shield size={50} style={{ marginBottom: '15px', opacity: 0.3 }} />
              <p style={{ fontWeight: 700 }}>No players found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Players;