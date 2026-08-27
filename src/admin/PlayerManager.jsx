import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Download, Search, Save, Trash2, Eye, X, Shield } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PlayerManager = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pSnap = await getDocs(query(collection(db, "players"), orderBy("name", "asc")));
      const pData = pSnap.docs.map(doc => ({ 
        id: doc.id, 
        goals: 0, 
        ...doc.data() 
      }));
      
      const tSnap = await getDocs(collection(db, "clubs"));
      setTeams(tSnap.docs.map(doc => doc.data().name));
      
      setPlayers(pData);
      setFilteredPlayers(pData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalUpdate = async (playerId, newGoals) => {
    setUpdatingId(playerId);
    try {
      const playerRef = doc(db, "players", playerId);
      const parsedGoals = parseInt(newGoals) || 0;
      await updateDoc(playerRef, { goals: parsedGoals });
      
      const updatedPlayers = players.map(p => 
        p.id === playerId ? { ...p, goals: parsedGoals } : p
      );
      setPlayers(updatedPlayers);
      applyFilters(updatedPlayers, selectedTeam, searchTerm);
    } catch (error) {
      console.error("Error updating goals:", error);
    }
    setUpdatingId(null);
  };

  const handleDeletePlayer = async (playerId, playerName) => {
    if (window.confirm(`Are you sure you want to remove ${playerName} due to eligibility doubts? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "players", playerId));
        const updatedPlayers = players.filter(p => p.id !== playerId);
        setPlayers(updatedPlayers);
        applyFilters(updatedPlayers, selectedTeam, searchTerm);
      } catch (error) {
        console.error("Error deleting player:", error);
        alert("Failed to delete player.");
      }
    }
  };

  const applyFilters = (data, team, search) => {
    let result = data;
    if (team !== 'All') {
      result = result.filter(p => p.team === team);
    }
    if (search.trim() !== '') {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredPlayers(result);
  };

  const handleTeamChange = (team) => {
    setSelectedTeam(team);
    applyFilters(players, team, searchTerm);
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    applyFilters(players, selectedTeam, search);
  };

  const generatePDF = () => {
    try {
      const docInstance = new jsPDF();
      const currentDate = new Date().toLocaleString();

      docInstance.setFillColor(15, 23, 42);
      docInstance.rect(0, 0, docInstance.internal.pageSize.getWidth(), 35, 'F');

      docInstance.setFont("helvetica", "bold");
      docInstance.setFontSize(15);
      docInstance.setTextColor(250, 204, 21);
      docInstance.text('ST. JEROME LEAGUE - OFFICIAL PLAYER ROSTER', 14, 18);
      
      docInstance.setFont("helvetica", "normal");
      docInstance.setFontSize(8.5);
      docInstance.setTextColor(203, 213, 225);
      docInstance.text(`Filter: ${selectedTeam.toUpperCase()} | Downloaded on: ${currentDate}`, 14, 26);

      docInstance.setFontSize(7.5);
      docInstance.setTextColor(148, 163, 184);
      docInstance.text('Note: Registration remains active; this export represents records captured up to the timestamp above.', 14, 43);

      const tableData = filteredPlayers.map((p, index) => [
        index + 1,
        p.name ? p.name.toUpperCase() : 'N/A',
        p.team || 'N/A',
        p.position || 'N/A',
        p.teamNumber || '-',
        p.goals || 0
      ]);

      autoTable(docInstance, {
        startY: 48,
        head: [['#', 'Player Name', 'Team', 'Position', 'Shirt #', 'Goals']],
        body: tableData,
        headStyles: { 
          fillColor: [30, 58, 138], 
          textColor: [250, 204, 21],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: { 
          fontSize: 8.5,
          textColor: [15, 23, 42]
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: 14, right: 14 }
      });

      docInstance.save(`${selectedTeam}_Roster_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF. Please check console.");
    }
  };

  return (
    <div className="player-manager-container">
      <style>{`
        .player-manager-container {
          padding: 20px 10px 50px 10px;
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
          width: 100%;
          animation: fadeIn 0.5s ease;
          color: #ffffff;
          text-align: center;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
          text-align: left;
        }

        .controls-wrapper {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
          justify-content: center;
          margin-bottom: 20px;
        }

        .filter-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
          justify-content: center;
        }

        .input-style {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0b1329;
          color: #ffffff;
          font-weight: 400;
          font-size: 0.85rem;
          outline: none;
          transition: 0.2s;
        }

        .input-style:focus {
          border-color: #facc15;
          box-shadow: 0 0 10px rgba(250, 204, 21, 0.15);
        }

        .table-container {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow-x: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          text-align: left;
        }

        .custom-table {
          width: 100%;
          border-collapse: collapse;
          white-space: nowrap;
        }

        .custom-th {
          background: #0b1329;
          color: #facc15;
          padding: 15px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .custom-td {
          padding: 14px 15px;
          font-size: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          text-align: center;
        }

        .custom-tr:hover {
          background: rgba(250, 204, 21, 0.03);
          cursor: pointer;
        }

        .action-btns {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
        }

        .icon-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .icon-btn:hover {
          background: rgba(250, 204, 21, 0.15);
          border-color: #facc15;
          color: #facc15;
        }

        .icon-btn.delete:hover {
          background: rgba(248, 113, 113, 0.15);
          border-color: #f87171;
          color: #f87171;
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(4, 6, 13, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 15px;
        }

        .modal-content {
          background: #0f172a;
          border: 1px solid rgba(250, 204, 21, 0.3);
          border-radius: 24px;
          width: 100%;
          max-width: 450px;
          padding: 25px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          animation: scaleUp 0.3s ease;
          box-sizing: border-box;
          max-height: 90vh;
          overflow-y: auto;
          text-align: left;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media(max-width: 768px) {
          .controls-wrapper { flex-direction: column; }
          .filter-group { width: 100%; flex-direction: column; }
        }
      `}</style>

      <div className="header-section">
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', margin: 0, letterSpacing: '0.5px' }}>Player & Stats Manager</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Total Registered: {filteredPlayers.length} Players</p>
        </div>
        
        <button 
          onClick={generatePDF} 
          style={{ background: '#facc15', color: '#04060d', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', boxShadow: '0 4px 15px rgba(250, 204, 21, 0.25)' }}
        >
          <Download size={16} /> EXPORT PDF ROSTER
        </button>
      </div>

      <div className="controls-wrapper">
        <div className="filter-group">
          <input 
            type="text"
            placeholder="Search player name..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-style"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />

          <select 
            value={selectedTeam}
            onChange={(e) => handleTeamChange(e.target.value)}
            className="input-style"
            style={{ cursor: 'pointer', width: '100%' }}
          >
            <option value="All">All Teams</option>
            {teams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th className="custom-th">Player Name</th>
              <th className="custom-th">Team</th>
              <th className="custom-th">Position</th>
              <th className="custom-th">Goals</th>
              <th className="custom-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No players found matching criteria.
                </td>
              </tr>
            ) : (
              filteredPlayers.map(p => (
                <tr key={p.id} className="custom-tr" onClick={() => setSelectedPlayer(p)}>
                  <td className="custom-td" style={{ textAlign: 'left', fontWeight: 'normal' }}>
                    {p.name ? p.name.toUpperCase() : 'UNKNOWN'}
                  </td>
                  <td className="custom-td" style={{ color: '#93c5fd' }}>
                    {p.team || 'Unassigned'}
                  </td>
                  <td className="custom-td">{p.position || '-'}</td>
                  <td className="custom-td" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <input 
                        type="number" 
                        defaultValue={p.goals || 0}
                        onBlur={(e) => handleGoalUpdate(p.id, e.target.value)}
                        className="input-style"
                        style={{ width: '55px', padding: '6px', textAlign: 'center' }}
                      />
                      {updatingId === p.id && <Save size={14} className="animate-pulse" color="#facc15" />}
                    </div>
                  </td>
                  <td className="custom-td" onClick={(e) => e.stopPropagation()}>
                    <div className="action-btns">
                      <button 
                        className="icon-btn" 
                        title="View Full Registration Details"
                        onClick={() => setSelectedPlayer(p)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="icon-btn delete" 
                        title="Delete Player (Eligibility Check)"
                        onClick={() => handleDeletePlayer(p.id, p.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#facc15" />
                <h3 style={{ margin: 0, color: '#facc15', fontSize: '1rem', fontWeight: 900 }}>REGISTRATION DETAILS</h3>
              </div>
              <button className="icon-btn" onClick={() => setSelectedPlayer(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <img 
                src={selectedPlayer.photoUrl || 'https://via.placeholder.com/100'} 
                alt="Player Profile" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #facc15', marginBottom: '10px' }} 
              />
              <h2 style={{ margin: 0, fontSize: '1.1rem', textAlign: 'center', fontWeight: 'normal' }}>{selectedPlayer.name ? selectedPlayer.name.toUpperCase() : ''}</h2>
              <span style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '4px' }}>{selectedPlayer.team || 'No Team'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#0b1329', padding: '15px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Team Number</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, fontSize: '0.85rem' }}>{selectedPlayer.teamNumber || 'N/A'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Sex</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, fontSize: '0.85rem' }}>{selectedPlayer.sex || 'N/A'}</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Years at St. Jerome</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, fontSize: '0.85rem' }}>{selectedPlayer.studyPeriod || selectedPlayer.periodOfStudy || 'N/A'}</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: `800` }}>Contact Info</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, fontSize: '0.85rem' }}>{selectedPlayer.contact || 'N/A'}</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedPlayer(null)}
              style={{ width: '100%', marginTop: '20px', background: '#facc15', color: '#04060d', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerManager;