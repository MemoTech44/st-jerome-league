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
  UserX,
  X,
  ChevronRight,
  Shield
} from 'lucide-react';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPlayer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPlayer]);

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
        (p.team && p.team.toLowerCase().includes(term))
      );
    }
    setFilteredPlayers(result);
  }, [searchTerm, viewMode, players]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <Loader2 className="animate-spin" size={48} color="#1e3a8a" />
      <p style={{ marginTop: '20px', fontWeight: 800, color: '#1e3a8a', letterSpacing: '1px', fontFamily: 'Plus Jakarta Sans' }}>SYNCING ROSTER...</p>
    </div>
  );

  return (
    <div className="players-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .players-page { background: #f8fafc; min-height: 100vh; padding: 140px 5% 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1100px; margin: 0 auto; }
        
        /* Header */
        .header-box { text-align: center; margin-bottom: 50px; }
        .header-box h1 { font-size: clamp(2.5rem, 6vw, 3.5rem); color: #1e3a8a; font-weight: 800; letter-spacing: -1.5px; margin: 0; }
        .header-underline { width: 60px; height: 5px; background: #facc15; margin: 20px auto; border-radius: 10px; }
        .header-description { max-width: 750px; margin: 0 auto; color: #64748b; line-height: 1.8; font-size: 1.1rem; font-weight: 500; }

        /* Controls Bar - Optimized Search Width */
        .controls-bar { 
          display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; align-items: center;
          background: white; padding: 25px; border-radius: 32px;
          margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;
        }
        .search-box { position: relative; width: 350px; max-width: 100%; }
        .search-box input { 
          width: 100%; padding: 16px 16px 16px 54px; border-radius: 20px; 
          border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; font-family: inherit;
          transition: 0.3s; font-size: 1rem; box-sizing: border-box;
        }
        .search-box input:focus { outline: none; border-color: #1e3a8a; background: white; box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.05); }
        .search-box svg { position: absolute; left: 20px; top: 18px; color: #94a3b8; }

        .filter-group { display: flex; gap: 12px; }
        .toggle-btn { 
          padding: 14px 24px; border-radius: 18px; border: none; font-weight: 800; 
          cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 0.85rem;
          transition: 0.3s; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }

        /* Table Design */
        .table-wrapper { 
          background: white; border-radius: 32px; overflow: hidden; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; 
        }
        table { width: 100%; border-collapse: collapse; }
        th { 
          padding: 24px; font-size: 0.75rem; text-transform: uppercase; 
          letter-spacing: 1.5px; font-weight: 800; color: #1e3a8a; 
          background: #f8fafc; text-align: left; border-bottom: 1px solid #e2e8f0;
        }
        td { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b; transition: 0.2s; }
        tr:hover td { background: #f8fafc; cursor: pointer; }
        
        .player-identity { display: flex; align-items: center; gap: 14px; font-weight: 800; }
        .row-avatar { width: 42px; height: 42px; border-radius: 14px; object-fit: cover; background: #eff6ff; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .club-tag { background: #eff6ff; color: #1e3a8a; padding: 6px 14px; border-radius: 10px; font-size: 0.8rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; }

        /* Modal */
        .modal-overlay { 
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px);
          z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .modal-card { 
          background: white; width: 100%; max-width: 450px; border-radius: 40px; 
          overflow: hidden; position: relative; border-bottom: 10px solid #facc15;
          animation: slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-hero-img { width: 100%; height: 350px; object-fit: cover; background: #0f172a; }

        @media (max-width: 850px) {
          .controls-bar { flex-direction: column; padding: 20px; }
          .search-box { width: 100%; }
          .filter-group { width: 100%; }
          .toggle-btn { flex: 1; justify-content: center; }
          .hide-on-mobile { display: none; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <h1>League Talent</h1>
          <div className="header-underline"></div>
          <p className="header-description">
            Welcome to the official roster for the St. Jerome Alumni League. Here, you can browse through 
            our elite community of athletes, verify player affiliations, and track individual 
            scoring statistics for the current season. Our registry is updated live to ensure 
            complete transparency across all participating clubs.
          </p>
        </header>

        <div className="controls-bar">
          <div className="search-box">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search players or teams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button 
              className="toggle-btn" 
              onClick={() => setViewMode('all')} 
              style={{ 
                background: viewMode === 'all' ? '#1e3a8a' : '#f1f5f9', 
                color: viewMode === 'all' ? 'white' : '#64748b' 
              }}
            >
              <User size={18} /> ALL PLAYERS
            </button>
            <button 
              className="toggle-btn" 
              onClick={() => setViewMode('scorers')} 
              style={{ 
                background: viewMode === 'scorers' ? '#facc15' : '#f1f5f9', 
                color: viewMode === 'scorers' ? '#1e293b' : '#64748b' 
              }}
            >
              <Trophy size={18} /> SCORERS
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          {filteredPlayers.length === 0 ? (
            <div style={{ padding: '100px 20px', textAlign: 'center' }}>
              <UserX size={60} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontWeight: 800, color: '#1e3a8a', marginBottom: '10px' }}>No Results Found</h3>
              <p style={{ color: '#94a3b8', fontWeight: 600 }}>Try searching for a different name or team.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Team Name</th>
                  <th className="hide-on-mobile">Position</th>
                  <th style={{ textAlign: 'center' }}>Goals</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                    <td>
                      <div className="player-identity">
                        <img 
                          src={player.photo || `https://ui-avatars.com/api/?name=${player.name}&background=eff6ff&color=1e3a8a`} 
                          className="row-avatar" 
                          alt="" 
                        />
                        {player.name}
                      </div>
                    </td>
                    <td>
                      <span className="club-tag">
                        <Shield size={14} /> {player.team || "Independent"}
                      </span>
                    </td>
                    <td className="hide-on-mobile" style={{ color: '#64748b' }}>{player.position}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: '#1e3a8a' }}>
                      {player.goals > 0 ? player.goals : '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ color: '#facc15', display: 'flex', justifyContent: 'center' }}>
                        <ChevronRight size={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedPlayer && (
          <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedPlayer(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', zIndex: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              >
                <X size={24} color="#1e3a8a" />
              </button>

              <img 
                src={selectedPlayer.photo || `https://placehold.co/600x800/1e293b/white?text=${selectedPlayer.name}`} 
                className="modal-hero-img" 
                alt={selectedPlayer.name} 
              />

              <div style={{ padding: '40px', textAlign: 'center' }}>
                <span style={{ color: '#1e3a8a', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
                  {selectedPlayer.team}
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0', lineHeight: 1.1 }}>
                  {selectedPlayer.name}
                </h2>
                <p style={{ color: '#64748b', fontWeight: 700, fontSize: '1.1rem', marginBottom: '30px' }}>{selectedPlayer.position}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <TrendingUp size={20} color="#1e3a8a" style={{ marginBottom: '8px' }} />
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Season Goals</span>
                    <b style={{ fontSize: '1.8rem', color: '#1e3a8a' }}>{selectedPlayer.goals}</b>
                  </div>
                  <div style={{ background: '#fffbeb', padding: '20px', borderRadius: '24px', border: '1px solid #fef3c7' }}>
                    <ShieldCheck size={20} color="#b45309" style={{ marginBottom: '8px' }} />
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>Status</span>
                    <b style={{ fontSize: '1.1rem', color: '#92400e', display: 'block', marginTop: '10px' }}>VERIFIED</b>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPlayer(null)}
                  style={{ 
                    marginTop: '35px', width: '100%', padding: '20px', borderRadius: '20px', 
                    background: '#1e3a8a', color: 'white', border: 'none', fontWeight: 900, 
                    cursor: 'pointer', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.2)',
                    fontSize: '1rem'
                  }}
                >
                  CLOSE PROFILE
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