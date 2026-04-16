import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserPlus, Upload, Loader2, ShieldCheck } from 'lucide-react';

const PlayerRegistration = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
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
      const snap = await getDocs(collection(db, "clubs"));
      setTeams(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
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
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#1e40af' }}>
      <ShieldCheck size={80} style={{ margin: '0 auto 20px' }} />
      <h2 style={{ fontFamily: 'Archivo' }}>REGISTRATION SUBMITTED!</h2>
      <p>Your details have been sent to the league admin for verification.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontFamily: 'Archivo', color: '#1e40af', textTransform: 'uppercase' }}>Player Registration</h2>
        <p style={{ color: '#64748b' }}>Complete all fields to join the St. Jerome League.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e40af' }}>FULL NAME</label>
          <input style={inputStyle} type="text" required onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e40af' }}>SELECT TEAM</label>
            <select style={inputStyle} required onChange={e => setFormData({...formData, team: e.target.value})}>
              <option value="">Choose Club</option>
              {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e40af' }}>POSITION</label>
            <select style={inputStyle} required onChange={e => setFormData({...formData, position: e.target.value})}>
              <option value="">Select Position</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e40af' }}>EMAIL ADDRESS</label>
          <input style={inputStyle} type="email" required onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e40af' }}>CONTACT NUMBER</label>
          <input style={inputStyle} type="tel" required placeholder="07..." onChange={e => setFormData({...formData, contact: e.target.value})} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e40af' }}>PASSPORT PHOTO</label>
          <div onClick={() => document.getElementById('pPhoto').click()} style={uploadStyle}>
            <Upload size={20} />
            <span style={{ fontSize: '0.8rem' }}>{photo ? photo.name : "Click to upload photo"}</span>
            <input id="pPhoto" type="file" hidden accept="image/*" required onChange={e => setPhoto(e.target.files[0])} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : "SUBMIT REGISTRATION"}
        </button>
      </form>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginTop: '5px', border: '2px solid #f1f5f9', borderRadius: '8px', background: '#f8fafc', fontWeight: 600 };
const uploadStyle = { border: '2px dashed #cbd5e1', padding: '15px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const btnStyle = { width: '100%', background: '#1e40af', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' };

export default PlayerRegistration;