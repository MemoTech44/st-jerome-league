import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { User, Download, Search, Save, Trophy } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PlayerManager = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pSnap = await getDocs(query(collection(db, "players"), orderBy("name", "asc")));
    const pData = pSnap.docs.map(doc => ({ 
      id: doc.id, 
      goals: 0, // Default if not set
      ...doc.data() 
    }));
    
    const tSnap = await getDocs(collection(db, "clubs"));
    setTeams(tSnap.docs.map(doc => doc.data().name));
    
    setPlayers(pData);
    setFilteredPlayers(pData);
    setLoading(false);
  };

  // Function to update goals in Firestore
  const handleGoalUpdate = async (playerId, newGoals) => {
    setUpdatingId(playerId);
    try {
      const playerRef = doc(db, "players", playerId);
      await updateDoc(playerRef, {
        goals: parseInt(newGoals) || 0
      });
      
      // Update local state
      const updatedPlayers = players.map(p => 
        p.id === playerId ? { ...p, goals: parseInt(newGoals) || 0 } : p
      );
      setPlayers(updatedPlayers);
      applyFilter(updatedPlayers, selectedTeam);
    } catch (error) {
      console.error("Error updating goals:", error);
    }
    setUpdatingId(null);
  };

  const applyFilter = (data, team) => {
    if (team === 'All') {
      setFilteredPlayers(data);
    } else {
      setFilteredPlayers(data.filter(p => p.team === team));
    }
  };

  const filterByTeam = (team) => {
    setSelectedTeam(team);
    applyFilter(players, team);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`ST. JEROME LEAGUE - ${selectedTeam.toUpperCase()} ROSTER`, 14, 20);
    
    const tableData = filteredPlayers.map((p, index) => [
      index + 1,
      p.name.toUpperCase(),
      p.team,
      p.position,
      p.goals // Added goals to PDF
    ]);

    doc.autoTable({
      startY: 30,
      head: [['#', 'Player Name', 'Team', 'Position', 'Goals']],
      body: tableData,
      headStyles: { fillStyle: '#1e40af' }
    });

    doc.save(`${selectedTeam}_Squad_List.pdf`);
  };

  return (
    <div style={{ color: '#0f172a', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h3 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', margin: 0 }}>Player & Stats Manager</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Total: {filteredPlayers.length} Players</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            onChange={(e) => filterByTeam(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '2px solid #1e40af', fontWeight: 700 }}
          >
            <option value="All">All Teams</option>
            {teams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={generatePDF} style={{ background: '#facc15', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Download size={18} /> EXPORT PDF
          </button>
        </div>
      </div>

      <div style={tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1e40af', color: 'white', textAlign: 'left' }}>
              <th style={thStyle}>Player</th>
              <th style={thStyle}>Team</th>
              <th style={thStyle}>Position</th>
              <th style={thStyle}>Goals Scored</th>
              <th style={thStyle}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={p.photoUrl} alt="" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #facc15' }} />
                    <span style={{ fontWeight: 700 }}>{p.name.toUpperCase()}</span>
                  </div>
                </td>
                <td style={tdStyle}><span style={teamBadge}>{p.team}</span></td>
                <td style={tdStyle}>{p.position}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="number" 
                      defaultValue={p.goals}
                      onBlur={(e) => handleGoalUpdate(p.id, e.target.value)}
                      style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}
                    />
                    {updatingId === p.id && <Save size={14} className="animate-pulse" color="#1e40af" />}
                  </div>
                </td>
                <td style={tdStyle}>{p.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableWrapper = { background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' };
const thStyle = { padding: '15px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' };
const tdStyle = { padding: '12px 15px', fontSize: '0.9rem' };
const teamBadge = { background: '#eff6ff', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.7rem' };

export default PlayerManager;