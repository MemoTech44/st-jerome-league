import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserPlus, Upload, Loader2, ShieldCheck, Camera } from 'lucide-react';

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
        const snap = await getDocs(collection(db, "clubs"));
        setTeams(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
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
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={pageWrapper}>
      <div style={successCard}>
        <div style={iconCircle}>
          <ShieldCheck size={40} color="#1e40af" />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e40af', marginBottom: '10px' }}>SUCCESS!</h2>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Your registration is pending verification.</p>
        <button onClick={() => window.location.reload()} style={btnStyle}>REGISTER ANOTHER</button>
      </div>
    </div>
  );

  return (
    <div style={pageWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus, select:focus { outline: none; border-color: #1e40af !important; box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1); }
      `}</style>

      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={badgeIcon}>
            <UserPlus size={24} color="#1e40af" />
          </div>
          <h1 style={headerStyle}>Player Registration</h1>
          <p style={subHeaderStyle}>Join the St. Jerome League Season 2026/2027</p>
        </div>

        <form onSubmit={handleSubmit} style={formCardStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>FULL NAME</label>
            <input style={inputStyle} type="text" placeholder="Enter official name" required onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div style={inputGroup}>
              <label style={labelStyle}>SELECT CLUB</label>
              <select style={inputStyle} required onChange={e => setFormData({...formData, team: e.target.value})}>
                <option value="">Choose...</option>
                {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>FIELD POSITION</label>
              <select style={inputStyle} required onChange={e => setFormData({...formData, position: e.target.value})}>
                <option value="">Select...</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>EMAIL ADDRESS</label>
            <input style={inputStyle} type="email" placeholder="example@gmail.com" required onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>WHATSAPP / CONTACT</label>
            <input style={inputStyle} type="tel" required placeholder="07... / 01..." onChange={e => setFormData({...formData, contact: e.target.value})} />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={labelStyle}>PASSPORT PHOTO</label>
            <div onClick={() => document.getElementById('pPhoto').click()} style={{...uploadStyle, borderColor: photo ? '#1e40af' : '#cbd5e1'}}>
              {photo ? <ShieldCheck color="#1e40af" size={20} /> : <Camera size={20} />}
              <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                {photo ? photo.name : "Click to select passport photo"}
              </span>
              <input id="pPhoto" type="file" hidden accept="image/*" required onChange={e => setPhoto(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : "COMPLETE REGISTRATION"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Adjusted Styles
const pageWrapper = {
  minHeight: '100vh',
  background: '#f1f5f9',
  padding: '20px', 
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  boxSizing: 'border-box'
};

const containerStyle = {
  maxWidth: '500px',
  margin: '100px auto 40px', // Pushed lower (100px from top) to avoid Navbar
};

const badgeIcon = {
  background: '#facc15',
  width: '50px', // Slightly smaller
  height: '50px', // Slightly smaller
  borderRadius: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 12px',
  boxShadow: '0 4px 10px rgba(250, 204, 21, 0.25)'
};

const headerStyle = {
  fontSize: '1.75rem', // Slightly smaller
  fontWeight: 800,
  color: '#1e40af',
  letterSpacing: '-0.5px',
  margin: '0'
};

const subHeaderStyle = {
  color: '#64748b',
  fontWeight: 600,
  fontSize: '0.9rem',
  marginTop: '4px'
};

const formCardStyle = {
  background: 'white',
  padding: '30px', // Tighter padding
  borderRadius: '20px',
  boxShadow: '0 15px 30px -5px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0'
};

const inputGroup = { marginBottom: '15px' };

const labelStyle = {
  display: 'block',
  fontWeight: 800,
  fontSize: '0.65rem',
  color: '#1e40af',
  letterSpacing: '1px',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '2px solid #f1f5f9',
  borderRadius: '10px',
  background: '#f8fafc',
  fontWeight: 600,
  fontSize: '0.85rem',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box'
};

const uploadStyle = {
  border: '2px dashed',
  padding: '15px',
  borderRadius: '10px',
  textAlign: 'center',
  cursor: 'pointer',
  background: '#f8fafc',
  color: '#64748b',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: '0.2s'
};

const btnStyle = {
  width: '100%',
  background: '#1e40af',
  color: '#facc15',
  padding: '14px',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 800,
  fontSize: '0.9rem',
  cursor: 'pointer',
  boxShadow: '0 8px 12px -3px rgba(30, 64, 175, 0.25)'
};

const successCard = {
  background: 'white',
  maxWidth: '350px',
  margin: '120px auto',
  padding: '40px 25px',
  borderRadius: '24px',
  textAlign: 'center',
  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
};

const iconCircle = {
  width: '70px',
  height: '70px',
  background: 'rgba(30, 64, 175, 0.1)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 15px'
};

export default PlayerRegistration;