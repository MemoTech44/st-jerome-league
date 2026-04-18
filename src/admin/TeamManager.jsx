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
import { Trash2, Shield, Plus, Loader2, UploadCloud, Edit3, X, Info, UserCheck, Briefcase, Flag, Wallet, Star } from 'lucide-react';

const TeamManager = () => {
  const [teams, setTeams] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State (Aligned with About Page Modal)
  const [teamName, setTeamName] = useState('');
  const [logo, setLogo] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState('');
  const [chairman, setChairman] = useState('');
  const [coach, setCoach] = useState('');
  const [captain, setCaptain] = useState('');
  const [treasurer, setTreasurer] = useState('');
  const [rep, setRep] = useState('');
  const [description, setDescription] = useState('');

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
    setTeamName(team.name || '');
    setExistingLogoUrl(team.logoUrl || '');
    setChairman(team.chairman || '');
    setCoach(team.coach || '');
    setCaptain(team.captain || '');
    setTreasurer(team.treasurer || '');
    setRep(team.rep || '');
    setDescription(team.description || '');
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTeamName('');
    setLogo(null);
    setEditingId(null);
    setExistingLogoUrl('');
    setChairman('');
    setCoach('');
    setCaptain('');
    setTreasurer('');
    setRep('');
    setDescription('');
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

      const teamPayload = {
        name: teamName,
        logoUrl,
        chairman,
        coach,
        captain,
        treasurer,
        rep,
        description,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, "clubs", editingId), teamPayload);
      } else {
        await addDoc(collection(db, "clubs"), {
          ...teamPayload,
          played: 0, won: 0, drawn: 0, lost: 0,
          gf: 0, ga: 0, gd: 0, pts: 0,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
      fetchTeams();
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deleting this team will remove all their data and stats. Proceed?")) {
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
        .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; }
        .team-admin-card { background: white; padding: 25px; border-radius: 20px; border: 1px solid #e2e8f0; text-align: center; position: relative; transition: 0.3s ease; }
        .team-admin-card:hover { border-color: #1e40af; transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,0,0,0.05); }
        .team-admin-card img { width: 80px; height: 80px; object-fit: contain; margin-bottom: 15px; }
        
        .add-team-form { background: #ffffff; padding: 40px; border-radius: 30px; border: 2px solid #1e40af; margin-bottom: 40px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
        .input-group label { font-weight: 800; font-size: 0.7rem; color: #1e40af; text-transform: uppercase; letter-spacing: 1px; }
        
        .input-style { width: 100%; padding: 14px; border: 2px solid #f1f5f9; border-radius: 12px; font-family: inherit; background: #f8fafc; font-weight: 600; transition: 0.2s; }
        .input-style:focus { border-color: #facc15; outline: none; background: white; }
        
        .upload-area { border: 2px dashed #cbd5e1; padding: 25px; border-radius: 15px; text-align: center; cursor: pointer; background: #f8fafc; transition: 0.2s; }
        .upload-area:hover { border-color: #1e40af; background: #eff6ff; }
        
        .action-overlay { display: flex; gap: 8px; position: absolute; top: 15px; right: 15px; }
        .mini-btn { width: 35px; height: 35px; border-radius: 10px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        
        @media (max-width: 700px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e40af', fontWeight: 900, fontSize: '1.8rem' }}>CLUB ROSTER</h2>
          <p style={{ margin: 0, color: '#64748b', fontWeight: 600 }}>Manage member profiles and credentials</p>
        </div>
        <button 
          onClick={() => isAdding ? resetForm() : setIsAdding(true)}
          style={{ background: isAdding ? '#ef4444' : '#facc15', color: isAdding ? 'white' : '#0f172a', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {isAdding ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Register New Club</>}
        </button>
      </div>

      {isAdding && (
        <form className="add-team-form" onSubmit={handleSaveTeam}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <div style={{ background: '#1e40af', padding: '8px', borderRadius: '10px' }}><Shield color="white" size={24} /></div>
            <h3 style={{ margin: 0, color: '#1e40af', fontWeight: 900 }}>{editingId ? 'UPDATE CLUB PROFILE' : 'NEW CLUB REGISTRATION'}</h3>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>Official Club Name</label>
              <input className="input-style" type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. Ndama Veterans FC" required />
            </div>
            <div className="input-group">
              <label>Club Crest / Logo</label>
              <div className="upload-area" onClick={() => document.getElementById('logoInput').click()}>
                <p style={{margin: 0, fontSize: '0.85rem', color: '#1e40af', fontWeight: 700 }}>
                  {logo ? logo.name : existingLogoUrl ? "Change Current Logo" : "Upload High-Res Logo"}
                </p>
                <input id="logoInput" type="file" hidden accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
              </div>
            </div>
          </div>

          <div style={{ margin: '20px 0', padding: '20px', background: '#f1f5f9', borderRadius: '20px' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Leadership & Roles (Pop-up Data)</p>
            <div className="form-row">
              <div className="input-group">
                <label>Chairman</label>
                <input className="input-style" type="text" value={chairman} onChange={(e) => setChairman(e.target.value)} placeholder="Full Name" />
              </div>
              <div className="input-group">
                <label>Head Coach</label>
                <input className="input-style" type="text" value={coach} onChange={(e) => setCoach(e.target.value)} placeholder="Full Name" />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Club Captain</label>
                <input className="input-style" type="text" value={captain} onChange={(e) => setCaptain(e.target.value)} placeholder="Full Name" />
              </div>
              <div className="input-group">
                <label>Treasurer</label>
                <input className="input-style" type="text" value={treasurer} onChange={(e) => setTreasurer(e.target.value)} placeholder="Full Name" />
              </div>
            </div>
            <div className="input-group">
              <label>Executive Representative</label>
              <input className="input-style" type="text" value={rep} onChange={(e) => setRep(e.target.value)} placeholder="League Executive Member Name" />
            </div>
          </div>

          <div className="input-group">
            <label>Club Biography / Description</label>
            <textarea 
              className="input-style" 
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story of this club, its year group, and achievements..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', background: '#1e40af', color: 'white', padding: '20px', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', fontSize: '1rem', marginTop: '10px' }}
          >
            {loading ? <Loader2 className="animate-spin" style={{margin: '0 auto'}} /> : editingId ? "Save Profile Changes" : "Confirm Registration"}
          </button>
        </form>
      )}

      <div className="team-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-admin-card">
            <div className="action-overlay">
              <button className="mini-btn" style={{ background: '#eff6ff', color: '#1e40af' }} onClick={() => handleEditClick(team)}>
                <Edit3 size={18} />
              </button>
              <button className="mini-btn" style={{ background: '#fee2e2', color: '#ef4444' }} onClick={() => handleDelete(team.id)}>
                <Trash2 size={18} />
              </button>
            </div>

            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} />
            ) : (
              <div style={{ padding: '20px' }}><Shield size={60} color="#cbd5e1" /></div>
            )}
            
            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 800 }}>{team.name}</h4>
            <p style={{ margin: '0 0 15px 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>{team.captain || 'No Captain Assigned'}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800 }}>PTS: {team.pts}</div>
              <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800 }}>GD: {team.gd}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;