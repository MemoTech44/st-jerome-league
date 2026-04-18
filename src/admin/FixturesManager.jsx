import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, addDoc, getDocs, query, orderBy, 
  deleteDoc, doc, updateDoc, where 
} from 'firebase/firestore';
import { 
  Trash2, Edit2, Check, X, Loader2, Clock, MapPin, Calendar, Plus, Trophy, ChevronRight
} from 'lucide-react';

const FixturesManager = () => {
  const [fixtures, setFixtures] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedSeason, setSelectedSeason] = useState("Season 2");

  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4"];

  const [formData, setFormData] = useState({
    matchday: 1,
    venue: '',
    date: '',
    homeTeam: '',
    awayTeam: '',
    time: ''
  });

  useEffect(() => { fetchData(); }, [selectedSeason]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clubSnap = await getDocs(collection(db, "clubs"));
      setClubs(clubSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const fixQuery = query(
        collection(db, "fixtures"), 
        where("season", "==", selectedSeason),
        orderBy("matchday", "asc"), 
        orderBy("time", "asc")
      );
      const fixDocs = await getDocs(fixQuery);
      setFixtures(fixDocs.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "fixtures"), {
        ...formData,
        season: selectedSeason,
        matchday: Number(formData.matchday),
        status: 'upcoming'
      });
      setFormData(prev => ({ ...prev, homeTeam: '', awayTeam: '', time: '' }));
      fetchData();
    } catch (err) { alert("Failed to add fixture"); }
  };

  const handleUpdate = async (id) => {
    await updateDoc(doc(db, "fixtures", id), { 
        ...editFormData,
        matchday: Number(editFormData.matchday)
    });
    setEditingId(null);
    fetchData();
  };

  const grouped = fixtures.reduce((acc, fix) => {
    const md = fix.matchday || "Unassigned"; 
    if (!acc[md]) acc[md] = [];
    acc[md].push(fix);
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. Centered Season Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#e2e8f0', padding: '4px', borderRadius: '14px' }}>
          {seasons.map(s => (
            <button key={s} onClick={() => setSelectedSeason(s)} style={{
              padding: '10px 24px', borderRadius: '10px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem',
              transition: 'all 0.3s ease', 
              background: selectedSeason === s ? '#1e40af' : 'transparent',
              color: selectedSeason === s ? 'white' : '#64748b',
              boxShadow: selectedSeason === s ? '0 4px 12px rgba(30,64,175,0.2)' : 'none'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* 2. Admin Entry Card */}
      <div style={{ background: '#fff', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ background: '#1e40af', padding: '8px', borderRadius: '8px', color: 'white' }}><Plus size={20}/></div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1e293b' }}>Match Setup</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Assign matches to {selectedSeason}</p>
          </div>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="input-group">
             <label style={labelS}>Matchday</label>
             <input type="number" style={inputS} value={formData.matchday} onChange={e => setFormData({...formData, matchday: e.target.value})} required />
          </div>
          <div className="input-group">
             <label style={labelS}>Venue</label>
             <input placeholder="Stadium name" style={inputS} value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required />
          </div>
          <div className="input-group">
             <label style={labelS}>Date</label>
             <input type="date" style={inputS} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="input-group">
             <label style={labelS}>Home Team</label>
             <select style={inputS} value={formData.homeTeam} onChange={e => setFormData({...formData, homeTeam: e.target.value})} required>
                <option value="">Select</option>
                {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
             </select>
          </div>
          <div className="input-group">
             <label style={labelS}>Away Team</label>
             <select style={inputS} value={formData.awayTeam} onChange={e => setFormData({...formData, awayTeam: e.target.value})} required>
                <option value="">Select</option>
                {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
             </select>
          </div>
          <div className="input-group">
             <label style={labelS}>Time</label>
             <div style={{ display: 'flex', gap: '8px' }}>
                <input type="time" style={inputS} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                <button type="submit" style={{ background: '#1e40af', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>Add</button>
             </div>
          </div>
        </form>
      </div>

      {/* 3. Fixtures Display */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Loader2 className="animate-spin" color="#1e40af" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '30px', border: '2px dashed #e2e8f0' }}>
            <Calendar size={40} style={{ color: '#cbd5e1', marginBottom: '15px' }}/>
            <p style={{ fontWeight: 700, color: '#64748b' }}>No matches found for this season yet.</p>
        </div>
      ) : (
        Object.keys(grouped).sort((a,b) => a-b).map(md => (
          <div key={md} style={{ marginBottom: '45px' }}>
            
            {/* Centered Matchday Label */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ background: '#facc15', color: '#1e293b', padding: '6px 18px', borderRadius: '20px', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Matchday {md}
              </span>
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {grouped[md][0].venue}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> {grouped[md][0].date}</span>
              </div>
            </div>

            {/* List of Match Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {grouped[md].map(f => (
                <div key={f.id} style={{ 
                    background: 'white', border: '1px solid #f1f5f9', borderRadius: '20px', 
                    padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: '0.2s'
                }}>
                  {editingId === f.id ? (
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                      <input type="time" style={inputS} value={editFormData.time} onChange={e => setEditFormData({...editFormData, time: e.target.value})} />
                      <select style={inputS} value={editFormData.homeTeam} onChange={e => setEditFormData({...editFormData, homeTeam: e.target.value})}>
                        {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      <select style={inputS} value={editFormData.awayTeam} onChange={e => setEditFormData({...editFormData, awayTeam: e.target.value})}>
                        {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      <button onClick={() => handleUpdate(f.id)} style={{ color: 'green', background: 'none', border: 'none' }}><Check/></button>
                      <button onClick={() => setEditingId(null)} style={{ color: 'red', background: 'none', border: 'none' }}><X/></button>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: '80px', fontSize: '0.9rem', fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14}/> {f.time}
                      </div>

                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                        <span style={teamNameS}>{f.homeTeam}</span>
                        <div style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8' }}>VS</div>
                        <span style={{ ...teamNameS, textAlign: 'left' }}>{f.awayTeam}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', width: '80px', justifyContent: 'flex-end' }}>
                        <button onClick={() => { setEditingId(f.id); setEditFormData(f); }} style={iconBtn}><Edit2 size={16}/></button>
                        <button onClick={async () => { if(window.confirm("Delete fixture?")) { await deleteDoc(doc(db, "fixtures", f.id)); fetchData(); } }} style={{ ...iconBtn, color: '#ef4444' }}><Trash2 size={16}/></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Styling Constants
const inputS = { padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };
const labelS = { display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', marginLeft: '4px' };
const teamNameS = { fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', textAlign: 'right', flex: 1, textTransform: 'uppercase', letterSpacing: '-0.02em' };
const iconBtn = { background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: '0.2s', padding: '8px', borderRadius: '10px' };

export default FixturesManager;