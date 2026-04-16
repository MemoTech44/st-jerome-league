import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, Shield, Plus, Loader2, UploadCloud, Edit3, X, Eye } from 'lucide-react';

const TeamManager = () => {
  const [teams, setTeams] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [teamName, setTeamName] = useState('');
  const [logo, setLogo] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const querySnapshot = await getDocs(collection(db, "clubs"));
    const teamData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeams(teamData.sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleEditClick = (team) => {
    setEditingId(team.id);
    setTeamName(team.name);
    setExistingLogoUrl(team.logoUrl || '');
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTeamName('');
    setLogo(null);
    setEditingId(null);
    setExistingLogoUrl('');
    setIsAdding(false);
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = existingLogoUrl;

      if (logo) {
        const logoRef = ref(storage, `logos/${Date.now()}_${logo.name}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }

      if (editingId) {
        // UPDATE
        await updateDoc(doc(db, "clubs", editingId), {
          name: teamName,
          logoUrl,
        });
        alert("Team updated successfully!");
      } else {
        // CREATE NEW
        await addDoc(collection(db, "clubs"), {
          name: teamName,
          logoUrl,
          played: 0, won: 0, drawn: 0, lost: 0,
          gf: 0, ga: 0, gd: 0, pts: 0,
          createdAt: serverTimestamp(),
        });
        alert("Team registered!");
      }

      resetForm();
      fetchTeams();
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deleting this team will affect the league table. Proceed?")) {
      try {
        await deleteDoc(doc(db, "clubs", id));
        fetchTeams();
      } catch (error) {
        alert("Error deleting team.");
      }
    }
  };

  return (
    <div className="team-manager" style={{ color: '#0f172a' }}>
      <style>{`
        .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-top: 20px; }
        .team-admin-card { background: white; padding: 20px; border-radius: 12px; border: 2px solid #f1f5f9; text-align: center; position: relative; transition: 0.3s; }
        .team-admin-card:hover { border-color: #facc15; transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .team-admin-card img { width: 70px; height: 70px; object-fit: contain; margin-bottom: 10px; }
        .add-team-form { background: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid #1e40af; margin-bottom: 30px; }
        .input-style { width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #f1f5f9; border-radius: 8px; font-family: inherit; background: #f8fafc; font-weight: 600; }
        .input-style:focus { border-color: #facc15; outline: none; }
        .upload-area { border: 2px dashed #cbd5e1; padding: 20px; border-radius: 8px; text-align: center; cursor: pointer; margin-bottom: 15px; background: #f8fafc; }
        .stats-badge { background: #1e40af; color: white; padding: 4px 10px; borderRadius: 20px; font-size: 0.65rem; font-weight: 800; margin: 2px; display: inline-block; }
        .action-overlay { display: flex; gap: 5px; position: absolute; top: 10px; right: 10px; }
        .mini-btn { padding: 6px; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', margin: 0, color: '#1e40af' }}>League Clubs</h3>
        <button 
          onClick={() => isAdding ? resetForm() : setIsAdding(true)}
          style={{ background: isAdding ? '#ef4444' : '#facc15', color: isAdding ? 'white' : '#0f172a', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isAdding ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add New Club</>}
        </button>
      </div>

      {isAdding && (
        <form className="add-team-form" onSubmit={handleSaveTeam}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1e40af' }}>{editingId ? 'EDIT CLUB DETAILS' : 'REGISTER NEW CLUB'}</h4>
          
          <label style={{fontWeight: 800, fontSize: '0.75rem', color: '#1e40af', textTransform: 'uppercase'}}>Club Name</label>
          <input 
            className="input-style"
            type="text" 
            placeholder="e.g. Kampala City FC" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            required 
          />
          
          <label style={{fontWeight: 800, fontSize: '0.75rem', color: '#1e40af', textTransform: 'uppercase', display: 'block', marginBottom: '10px'}}>Club Crest / Logo</label>
          <div className="upload-area" onClick={() => document.getElementById('logoInput').click()}>
            <UploadCloud size={32} color="#1e40af" style={{marginBottom: '5px'}} />
            <p style={{margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              {logo ? logo.name : existingLogoUrl ? "Click to change current logo" : "Upload PNG/JPG Logo"}
            </p>
            <input id="logoInput" type="file" hidden accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', background: '#1e40af', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}
          >
            {loading ? <Loader2 className="animate-spin" style={{margin: '0 auto'}} /> : editingId ? "Save Changes" : "Register Club"}
          </button>
        </form>
      )}

      <div className="team-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-admin-card">
            <div className="action-overlay">
              <button className="mini-btn" style={{ background: '#eff6ff', color: '#1e40af' }} onClick={() => handleEditClick(team)}>
                <Edit3 size={16} />
              </button>
              <button className="mini-btn" style={{ background: '#fee2e2', color: '#ef4444' }} onClick={() => handleDelete(team.id)}>
                <Trash2 size={16} />
              </button>
            </div>

            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} />
            ) : (
              <div style={{ padding: '15px' }}><Shield size={50} color="#cbd5e1" /></div>
            )}
            
            <h4 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', margin: '0 0 10px 0', fontSize: '1.1rem' }}>{team.name}</h4>
            
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              <div className="stats-badge">P: {team.played}</div>
              <div className="stats-badge">W: {team.won}</div>
              <div className="stats-badge" style={{ background: '#facc15', color: '#0f172a' }}>PTS: {team.pts}</div>
              <div className="stats-badge">GD: {team.gd}</div>
            </div>
            
            <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '10px', fontWeight: 700 }}>
              Auto-updating via Match Results
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;