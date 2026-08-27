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
  ChevronRight
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#04060d' }}>
      <Loader2 className="animate-spin" size={48} color="#facc15" />
      <p style={{ marginTop: '20px', fontWeight: 800, color: '#facc15', letterSpacing: '2px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem' }}>
        SYNCING ROSTER...
      </p>
    </div>
  );

  return (
    <div className="players-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .players-page { 
          background: #04060d; 
          min-height: 100vh; 
          padding: 120px 5% 80px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc;
          box-sizing: border-box;
        }

        .container { max-width: 1100px; margin: 0 auto; }
        .gold-text { color: #facc15; }
        
        /* Header Box */
        .header-box { text-align: center; margin-bottom: 50px; }
        
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
          margin: 0; 
          line-height: 1;
        }

        .header-underline { 
          width: 80px; 
          height: 4px; 
          background: linear-gradient(90deg, #facc15, rgba(250, 204, 21, 0.2)); 
          margin: 20px auto 25px; 
          border-radius: 4px; 
        }

        .header-description { 
          max-width: 720px; 
          margin: 0 auto; 
          color: #94a3b8; 
          line-height: 1.7; 
          font-size: 1rem; 
          font-weight: 500;
        }

        /* Controls Bar */
        .controls-bar { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 20px; 
          justify-content: space-between; 
          align-items: center;
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          padding: 20px 25px; 
          border-radius: 24px;
          margin-bottom: 35px; 
          box-shadow: 0 15px 35px rgba(0,0,0,0.4); 
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .search-box { position: relative; width: 340px; max-width: 100%; }
        
        .search-box input { 
          width: 100%; 
          padding: 14px 16px 14px 50px; 
          border-radius: 16px; 
          border: 1px solid rgba(255, 255, 255, 0.12); 
          background: #0f172a; 
          color: #ffffff;
          font-weight: 600; 
          font-family: inherit;
          transition: all 0.3s ease; 
          font-size: 0.95rem; 
          box-sizing: border-box;
        }

        .search-box input::placeholder { color: #64748b; }

        .search-box input:focus { 
          outline: none; 
          border-color: #facc15; 
          background: #0f172a; 
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.15); 
        }

        .search-box svg { 
          position: absolute; 
          left: 18px; 
          top: 50%;
          transform: translateY(-50%); 
          color: #facc15; 
        }

        .filter-group { display: flex; gap: 12px; }

        .toggle-btn { 
          padding: 12px 22px; 
          border-radius: 16px; 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          font-weight: 800; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          transition: all 0.3s ease; 
          white-space: nowrap; 
        }

        .toggle-btn.active-all, .toggle-btn.active-scorers {
          background: #facc15;
          color: #04060d;
          border-color: #facc15;
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.25);
        }

        .toggle-btn.inactive {
          background: rgba(15, 23, 42, 0.8);
          color: #94a3b8;
        }

        .toggle-btn.inactive:hover {
          color: #ffffff;
          border-color: rgba(250, 204, 21, 0.4);
        }

        /* Table Design */
        .table-wrapper { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          border-radius: 28px; 
          overflow: hidden; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
        }

        table { width: 100%; border-collapse: collapse; }

        th { 
          padding: 22px 24px; 
          font-size: 0.75rem; 
          text-transform: uppercase; 
          letter-spacing: 1.5px; 
          font-weight: 800; 
          color: #facc15; 
          background: rgba(15, 23, 42, 0.95); 
          text-align: left; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        td { 
          padding: 18px 24px; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.04); 
          font-weight: 600; 
          color: #e2e8f0; 
          transition: background 0.2s ease; 
        }

        tr:hover td { 
          background: rgba(250, 204, 21, 0.04); 
          cursor: pointer; 
        }

        .player-identity { display: flex; align-items: center; gap: 14px; font-weight: 700; color: #ffffff; }

        .row-avatar { 
          width: 44px; 
          height: 44px; 
          border-radius: 12px; 
          object-fit: cover; 
          background: #0f172a; 
          border: 1px solid rgba(250, 204, 21, 0.3); 
        }

        .club-text { 
          color: #cbd5e1; 
          font-size: 0.9rem; 
          font-weight: 400; 
        }

        /* Modal Styling */
        .modal-overlay { 
          position: fixed; 
          inset: 0; 
          background: rgba(4, 6, 13, 0.88); 
          backdrop-filter: blur(10px);
          z-index: 10000; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 20px;
        }

        .modal-card { 
          background: #0f172a; 
          color: #f8fafc;
          width: 100%; 
          max-width: 440px; 
          border-radius: 32px; 
          overflow: hidden; 
          position: relative; 
          border: 1px solid rgba(250, 204, 21, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
          animation: slideUp 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        @keyframes slideUp { 
          from { transform: translateY(30px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }

        .modal-hero-img { 
          width: 100%; 
          height: 320px; 
          object-fit: cover; 
          background: #04060d; 
          display: block;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          z-index: 10;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #facc15;
          color: #04060d;
        }

        @media (max-width: 850px) {
          .players-page { padding-top: 100px; }
          .controls-bar { flex-direction: column; padding: 20px; gap: 15px; }
          .search-box { width: 100%; }
          .filter-group { width: 100%; }
          .toggle-btn { flex: 1; justify-content: center; }
          .hide-on-mobile { display: none; }

          /* Mobile minimal table view */
          td { padding: 16px 18px; }
          .player-identity { font-weight: 400; color: #e2e8f0; }
          .club-text { font-size: 0.85rem; font-weight: 400; color: #94a3b8; }
        }
      `}</style>

      <div className="container">
        <header className="header-box">
          <span className="header-tag">Player Registry & Analytics</span>
          <h1>LEAGUE <span className="gold-text">TALENT</span></h1>
          <div className="header-underline"></div>
          <p className="header-description">
            Welcome to the official roster for the St. Jerome Alumni League. Browse through 
            our elite community of athletes, verify player affiliations, and track individual 
            scoring statistics for the current season.
          </p>
        </header>

        <div className="controls-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search players or teams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button 
              className={`toggle-btn ${viewMode === 'all' ? 'active-all' : 'inactive'}`}
              onClick={() => setViewMode('all')} 
            >
              <User size={16} /> ALL PLAYERS
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'scorers' ? 'active-scorers' : 'inactive'}`}
              onClick={() => setViewMode('scorers')} 
            >
              <Trophy size={16} /> SCORERS
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          {filteredPlayers.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
              <UserX size={56} className="gold-text" style={{ margin: '0 auto 15px' }} />
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: '#ffffff', margin: '0 0 5px 0' }}>
                No Results Found
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Try searching for a different name or team.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Team Name</th>
                  <th className="hide-on-mobile">Position</th>
                  <th className="hide-on-mobile" style={{ textAlign: 'center' }}>Goals</th>
                  <th className="hide-on-mobile" style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                    <td>
                      <div className="player-identity">
                        <img 
                          src={player.photo || `https://ui-avatars.com/api/?name=${player.name}&background=0f172a&color=facc15`} 
                          className="row-avatar hide-on-mobile" 
                          alt={player.name} 
                        />
                        {player.name}
                      </div>
                    </td>
                    <td>
                      <span className="club-text">
                        {player.team || "Independent"}
                      </span>
                    </td>
                    <td className="hide-on-mobile" style={{ color: '#94a3b8' }}>{player.position || 'N/A'}</td>
                    <td className="hide-on-mobile" style={{ textAlign: 'center', fontWeight: 800, color: player.goals > 0 ? '#facc15' : '#64748b' }}>
                      {player.goals > 0 ? player.goals : '—'}
                    </td>
                    <td className="hide-on-mobile" style={{ textAlign: 'center' }}>
                      <div style={{ color: '#facc15', display: 'flex', justifyContent: 'center' }}>
                        <ChevronRight size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PLAYER DETAILS MODAL */}
        {selectedPlayer && (
          <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedPlayer(null)}>
                <X size={20} color="#ffffff" />
              </button>

              <img 
                src={selectedPlayer.photo || `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80`} 
                className="modal-hero-img" 
                alt={selectedPlayer.name} 
              />

              <div style={{ padding: '30px 25px', textAlign: 'center' }}>
                <span style={{ color: '#facc15', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>
                  {selectedPlayer.team || "Independent Club"}
                </span>
                
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.4rem', color: '#ffffff', margin: '0 0 4px 0', lineHeight: 1 }}>
                  {selectedPlayer.name}
                </h2>
                
                <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', marginBottom: '25px' }}>
                  {selectedPlayer.position || 'Field Player'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <TrendingUp size={18} className="gold-text" style={{ marginBottom: '6px' }} />
                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Season Goals</span>
                    <b style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: '#ffffff' }}>{selectedPlayer.goals}</b>
                  </div>
                  
                  <div style={{ background: 'rgba(250, 204, 21, 0.05)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                    <ShieldCheck size={18} className="gold-text" style={{ marginBottom: '6px' }} />
                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
                    <b style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block', marginTop: '6px', fontWeight: 800 }}>VERIFIED</b>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPlayer(null)}
                  style={{ 
                    marginTop: '25px', width: '100%', padding: '15px', borderRadius: '16px', 
                    background: '#facc15', color: '#04060d', border: 'none', fontWeight: 800, 
                    cursor: 'pointer', boxShadow: '0 8px 20px rgba(250, 204, 21, 0.2)',
                    fontSize: '0.85rem', letterSpacing: '0.5px'
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