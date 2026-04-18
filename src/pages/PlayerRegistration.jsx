import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserPlus, Upload, Loader2, ShieldCheck, Camera, CheckCircle2 } from 'lucide-react';

const PlayerRegistration = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    team: '',
    position: '',
    email: '',
    contact: '',
    bio: ''
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Fetches from the 'clubs' collection
        const snap = await getDocs(collection(db, "clubs"));
        const sortedTeams = snap.docs
          .map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
              // Flexibility: handles 'name', 'teamName', or 'clubName'
              name: data.name || data.teamName || data.clubName || "Unnamed Team"
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setTeams(sortedTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Please upload your passport photo");
    setLoading(true);

    try {
      const photoRef = ref(storage, `players/${Date.now()}_${photo.name}`);
      await uploadBytes(photoRef, photo);
      const photoUrl = await getDownloadURL(photoRef);

      await addDoc(collection(db, "players"), {
        ...formData,
        photoUrl,
        status: 'pending',
        registeredAt: serverTimestamp()
      });

      setSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={pageWrapper}>
      <div style={successCard}>
        <div style={iconCircle}>
          <CheckCircle2 size={45} color="#1e40af" />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e40af', marginBottom: '10px', letterSpacing: '-1px' }}>APPLICATION SENT!</h2>
        <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.5, marginBottom: '25px' }}>
          Your profile has been submitted for review. You will be notified once verified.
        </p>
        <button onClick={() => setSuccess(false)} style={btnStyle}>REGISTER ANOTHER PLAYER</button>
      </div>
    </div>
  );

  return (
    <div style={pageWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        input:focus, select:focus, textarea:focus { 
          outline: none; 
          border-color: #1e40af !important; 
          background: white !important;
          box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.08); 
        }

        .upload-area:hover {
          border-color: #1e40af;
          background: #eff6ff;
        }
      `}</style>

      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={badgeIcon}>
            <UserPlus size={24} color="#1e40af" />
          </div>
          <h1 style={headerStyle}>Join the League</h1>
          <p style={subHeaderStyle}>Player Registration • Season 2026/2027</p>
        </div>

        <form onSubmit={handleSubmit} style={formCardStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>FULL LEGAL NAME</label>
            <input 
              style={inputStyle} 
              type="text" 
              placeholder="As it appears on ID" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={inputGroup}>
              <label style={labelStyle}>ASSIGNED CLUB</label>
              <select 
                style={inputStyle} 
                required 
                value={formData.team}
                onChange={e => setFormData({...formData, team: e.target.value})}
              >
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>PRIMARY POSITION</label>
              <select 
                style={inputStyle} 
                required 
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
              >
                <option value="">Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>EMAIL ADDRESS</label>
            <input 
              style={inputStyle} 
              type="email" 
              placeholder="personal@email.com" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>CONTACT / WHATSAPP NUMBER</label>
            <input 
              style={inputStyle} 
              type="tel" 
              required 
              placeholder="e.g. 0700 000 000" 
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})} 
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>IDENTITY PHOTO (PASSPORT SIZE)</label>
            <div 
              className="upload-area"
              onClick={() => document.getElementById('pPhoto').click()} 
              style={{...uploadStyle, borderColor: photo ? '#1e40af' : '#e2e8f0', background: photo ? '#f0f9ff' : '#f8fafc'}}
            >
              {photo ? <ShieldCheck color="#1e40af" size={22} /> : <Camera size={22} color="#94a3b8" />}
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: photo ? '#1e40af' : '#64748b' }}>
                {photo ? photo.name : "Tap to upload photo"}
              </span>
              <input 
                id="pPhoto" 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={e => setPhoto(e.target.files[0])} 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Loader2 className="animate-spin" size={20} />
                <span>PROCESSING...</span>
              </div>
            ) : "SUBMIT REGISTRATION"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES (Kept exactly as yours but ensured box-sizing) ---
const pageWrapper = {
  minHeight: '100vh',
  background: '#f8fafc',
  padding: '140px 20px 60px', 
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  boxSizing: 'border-box'
};

const containerStyle = { maxWidth: '480px', margin: '0 auto' };
const badgeIcon = { background: '#facc15', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 16px -4px rgba(250, 204, 21, 0.4)' };
const headerStyle = { fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-1px', margin: '0' };
const subHeaderStyle = { color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '1px' };
const formCardStyle = { background: 'white', padding: '35px', borderRadius: '32px', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const inputGroup = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontWeight: 800, fontSize: '0.65rem', color: '#1e3a8a', letterSpacing: '1.2px', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '14px 16px', border: '2px solid #f1f5f9', borderRadius: '14px', background: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', transition: 'all 0.2s ease', boxSizing: 'border-box' };
const uploadStyle = { border: '2px dashed', padding: '20px', borderRadius: '14px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s ease' };
const btnStyle = { width: '100%', background: '#1e3a8a', color: '#facc15', padding: '18px', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(30, 58, 138, 0.3)', transition: 'transform 0.2s ease' };
const successCard = { background: 'white', maxWidth: '400px', margin: '0 auto', padding: '50px 35px', borderRadius: '40px', textAlign: 'center', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
const iconCircle = { width: '80px', height: '80px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' };

export default PlayerRegistration;