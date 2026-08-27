import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, ShieldCheck, Camera, CheckCircle2, ChevronDown } from 'lucide-react';

// Custom Animated Dropdown Component
const CustomSelect = ({ label, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="input-group" ref={dropdownRef}>
      <label>{label}</label>
      <div className="custom-select-wrapper">
        <button 
          type="button"
          className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{ color: value ? '#ffffff' : '#64748b' }}>{selectedLabel}</span>
          <ChevronDown 
            size={18} 
            color="#facc15" 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 0.3s ease' 
            }} 
          />
        </button>

        {isOpen && (
          <div className="custom-options-menu">
            {options.map((opt) => (
              <div 
                key={opt.value}
                className={`custom-option ${value === opt.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerRegistration = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    team: '',
    teamNumber: '',
    position: '',
    sex: '',
    studyPeriod: '',
    contact: ''
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const snap = await getDocs(collection(db, "clubs"));
        const sortedTeams = snap.docs
          .map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
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
    if (!formData.name.trim()) return alert("Please enter your full name");
    if (!formData.team) return alert("Please select a team");
    if (!formData.teamNumber.trim()) return alert("Please enter your team number");
    if (!formData.position) return alert("Please select a playing position");
    if (!formData.sex) return alert("Please select sex");
    if (!formData.studyPeriod.trim()) return alert("Please enter your period of study");
    if (!formData.contact.trim()) return alert("Please enter your contact or WhatsApp number");
    if (!photo) return alert("Please upload your current passport photo");
    
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
      
      // Automatically redirect to home after 2.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 2500);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .reg-page {
          background-color: #04060d;
          min-height: 100vh;
          padding: 120px 20px 80px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f8fafc;
          box-sizing: border-box;
        }

        .container {
          max-width: 540px;
          margin: 0 auto;
        }

        .gold-text { color: #facc15; }

        .header-box {
          text-align: center;
          margin-bottom: 35px;
        }

        .header-tag {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .header-box h1 {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(2.8rem, 6vw, 4rem);
          color: #ffffff;
          letter-spacing: 2px;
          margin: 0 0 6px 0;
          line-height: 1;
        }

        .sub-header {
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Form Card */
        .form-card {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(16px);
          padding: 36px 30px;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .input-group {
          margin-bottom: 22px;
          position: relative;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-group label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: #facc15;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .r-input {
          width: 100%;
          background: rgba(4, 6, 13, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 14px 16px;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          outline: none;
          transition: all 0.3s ease;
          color: #ffffff;
          box-sizing: border-box;
          font-size: 0.95rem;
        }

        .r-input::placeholder {
          color: #64748b;
          font-weight: 500;
        }

        .r-input:focus {
          border-color: #facc15;
          background: rgba(4, 6, 13, 0.95);
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.18);
        }

        /* Custom Dropdown Styling */
        .custom-select-wrapper {
          position: relative;
        }

        .custom-select-trigger {
          width: 100%;
          background: rgba(4, 6, 13, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 14px 16px;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s ease;
          box-sizing: border-box;
          text-align: left;
        }

        .custom-select-trigger.active,
        .custom-select-trigger:hover {
          border-color: #facc15;
          background: rgba(4, 6, 13, 0.95);
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.18);
        }

        .custom-options-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #090d16;
          border: 1px solid rgba(250, 204, 21, 0.3);
          border-radius: 14px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
          z-index: 100;
          max-height: 220px;
          overflow-y: auto;
          padding: 6px;
        }

        .custom-option {
          padding: 12px 14px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #cbd5e1;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .custom-option:hover {
          background: rgba(250, 204, 21, 0.15);
          color: #facc15;
        }

        .custom-option.selected {
          background: #facc15;
          color: #04060d;
          font-weight: 800;
        }

        /* Upload Area */
        .upload-area {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          padding: 20px;
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(4, 6, 13, 0.5);
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #facc15;
          background: rgba(250, 204, 21, 0.05);
        }

        .upload-area.has-file {
          border-color: #facc15;
          background: rgba(250, 204, 21, 0.08);
        }

        /* Submit Button */
        .btn-submit {
          width: 100%;
          background: #facc15;
          color: #04060d;
          padding: 16px;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.2);
        }

        .btn-submit:hover:not(:disabled) {
          background: #ffe066;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(250, 204, 21, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Success Card */
        .success-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          padding: 50px 30px;
          border-radius: 28px;
          text-align: center;
          border: 1px solid rgba(250, 204, 21, 0.2);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .success-card h2 {
          font-family: 'Bebas Neue', cursive;
          font-size: 2.5rem;
          color: #ffffff;
          margin: 15px 0 5px;
          letter-spacing: 1px;
        }

        /* Scrollbar styling for custom dropdown */
        .custom-options-menu::-webkit-scrollbar {
          width: 6px;
        }
        .custom-options-menu::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-options-menu::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.3);
          border-radius: 4px;
        }

        @media (max-width: 600px) {
          .reg-page { padding-top: 100px; }
          .grid-2 { grid-template-columns: 1fr; }
          .form-card { padding: 25px 20px; }
        }
      `}</style>

      <div className="container">
        {success ? (
          <div className="success-card">
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <CheckCircle2 size={40} color="#facc15" />
            </div>
            <h2>REGISTRATION SUCCESSFUL!</h2>
            <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.95rem', marginBottom: '15px', lineHeight: 1.6 }}>
              Your player profile has been submitted successfully. Redirecting you home...
            </p>
          </div>
        ) : (
          <>
            <header className="header-box">
              <span className="header-tag">Official Enrollment</span>
              <h1>PLAYER <span className="gold-text">REGISTRATION</span></h1>
              <p className="sub-header">St. Jerome Alumni League • Season 2026/2027</p>
            </header>

            <form onSubmit={handleSubmit} className="form-card">
              {/* Name in Full */}
              <div className="input-group">
                <label>Name in Full *</label>
                <input 
                  className="r-input"
                  type="text" 
                  placeholder="e.g. Atumanya Memory" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              {/* Team and Team Number */}
              <div className="grid-2">
                <CustomSelect 
                  label="Team *"
                  value={formData.team}
                  options={teams.map(t => ({ value: t.name, label: t.name }))}
                  onChange={val => setFormData({...formData, team: val})}
                  placeholder="Select Team"
                />

                <div className="input-group">
                  <label>Team Number *</label>
                  <input 
                    className="r-input"
                    type="text" 
                    placeholder="e.g. NAT001" 
                    required 
                    value={formData.teamNumber}
                    onChange={e => setFormData({...formData, teamNumber: e.target.value})} 
                  />
                </div>
              </div>

              {/* Position and Sex */}
              <div className="grid-2">
                <CustomSelect 
                  label="Position *"
                  value={formData.position}
                  options={[
                    { value: 'Goalkeeper', label: 'Goalkeeper' },
                    { value: 'Defender', label: 'Defender' },
                    { value: 'Midfielder', label: 'Midfielder' },
                    { value: 'Forward', label: 'Forward' }
                  ]}
                  onChange={val => setFormData({...formData, position: val})}
                  placeholder="Select Position"
                />

                <CustomSelect 
                  label="Sex *"
                  value={formData.sex}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' }
                  ]}
                  onChange={val => setFormData({...formData, sex: val})}
                  placeholder="Select Sex"
                />
              </div>

              {/* Period of Study */}
              <div className="input-group">
                <label>Period of Study (years) at St. Jerome *</label>
                <input 
                  className="r-input"
                  type="text" 
                  placeholder="e.g. 2014 - 2019" 
                  required 
                  value={formData.studyPeriod}
                  onChange={e => setFormData({...formData, studyPeriod: e.target.value})} 
                />
              </div>

              {/* Contact */}
              <div className="input-group">
                <label>Contact / WhatsApp Number *</label>
                <input 
                  className="r-input"
                  type="tel" 
                  required 
                  placeholder="e.g. +256 700 000 000" 
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})} 
                />
              </div>

              {/* Passport Photo Upload */}
              <div className="input-group" style={{ marginBottom: '28px' }}>
                <label>Current Photo (Passport Size) *</label>
                <div 
                  className={`upload-area ${photo ? 'has-file' : ''}`}
                  onClick={() => document.getElementById('pPhoto').click()} 
                >
                  {photo ? <ShieldCheck color="#facc15" size={22} /> : <Camera size={22} color="#94a3b8" />}
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: photo ? '#facc15' : '#94a3b8' }}>
                    {photo ? photo.name : "Tap to upload current photo"}
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

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Loader2 className="animate-spin" size={20} />
                    <span>SUBMITTING REGISTRATION...</span>
                  </div>
                ) : "SUBMIT REGISTRATION"}
              </button>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                 <ShieldCheck size={14} color="#facc15" /> Official St. Jerome Alumni Verification
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerRegistration;