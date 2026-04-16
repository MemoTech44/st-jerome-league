import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, addDoc, getDocs, query, orderBy, 
  deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { 
  Calendar, MapPin, Trash2, Plus, Edit2, 
  Check, X, Loader2, AlertCircle, Clock 
} from 'lucide-react';

const FixturesManager = () => {
  const [fixtures, setFixtures] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  const [formData, setFormData] = useState({
    matchday: 1,
    venue: '',
    date: '',
    homeTeam: '',
    awayTeam: '',
    time: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clubSnap = await getDocs(collection(db, "clubs"));
      setClubs(clubSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const fixSnap = query(collection(db, "fixtures"), orderBy("matchday", "asc"), orderBy("date", "asc"), orderBy("time", "asc"));
      const fixDocs = await getDocs(fixSnap);
      setFixtures(fixDocs.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (formData.homeTeam === formData.awayTeam) {
      alert("A team cannot play against itself!");
      return;
    }

    try {
      await addDoc(collection(db, "fixtures"), {
        ...formData,
        matchday: Number(formData.matchday),
        status: 'upcoming',
        score: { home: 0, away: 0 }
      });
      // Reset only team/time selection, keep matchday/date/venue for batch entry
      setFormData({ ...formData, homeTeam: '', awayTeam: '', time: '' });
      fetchData();
    } catch (err) { alert("Error saving fixture"); }
  };

  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "fixtures", id), {
        ...editFormData,
        matchday: Number(editFormData.matchday)
      });
      setEditingId(null);
      fetchData();
    } catch (err) { alert("Update failed"); }
  };

  // Grouping matches by Matchday
  const groupedFixtures = fixtures.reduce((acc, fix) => {
    const key = fix.matchday;
    if (!acc[key]) acc[key] = [];
    acc[key].push(fix);
    return acc;
  }, {});

  if (loading) return (
    <div style={loaderContainer}>
      <Loader2 className="animate-spin" size={30} />
      <span>Syncing Schedule...</span>
    </div>
  );

  return (
    <div style={{ color: '#0f172a', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* 1. Entry Form */}
      <div style={formStyle}>
        <h4 style={headerStyle}><Plus size={20}/> Schedule New Match</h4>
        <form onSubmit={handleCreate}>
          <div style={inputGrid}>
            <div>
              <label style={labelStyle}>Matchday</label>
              <input style={inputStyle} type="number" value={formData.matchday} onChange={e => setFormData({...formData, matchday: e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Venue</label>
              <input style={inputStyle} type="text" placeholder="e.g. Jerome Arena" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
          </div>

          <div style={matchInputRow}>
            <div style={{ flex: 1 }}>
              <select style={selectStyle} value={formData.homeTeam} onChange={e => setFormData({...formData, homeTeam: e.target.value})} required>
                <option value="">Select Home Team</option>
                {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <span style={{ color: '#cbd5e1', fontWeight: 900 }}>VS</span>
            <div style={{ flex: 1 }}>
              <select style={selectStyle} value={formData.awayTeam} onChange={e => setFormData({...formData, awayTeam: e.target.value})} required>
                <option value="">Select Away Team</option>
                {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ width: '130px' }}>
              <input style={inputStyle} type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
            </div>
            <button type="submit" style={submitBtnStyle}>Schedule</button>
          </div>
        </form>
      </div>

      {/* 2. The List */}
      {fixtures.length === 0 ? (
        <div style={emptyStateStyle}>
          <AlertCircle size={40} />
          <p>No fixtures scheduled yet.</p>
        </div>
      ) : (
        Object.keys(groupedFixtures).sort((a, b) => a - b).map(md => (
          <div key={md} style={{ marginBottom: '40px' }}>
            <div style={matchdayHeader}>
                <div style={badgeStyle}>Matchday {md}</div>
                <div style={{ height: '2px', flex: 1, background: '#f1f5f9', marginLeft: '15px' }}></div>
            </div>

            {groupedFixtures[md].map(f => (
              <div key={f.id} style={editingId === f.id ? editCardStyle : fixtureCardStyle}>
                {editingId === f.id ? (
                  <div style={editModeGrid}>
                    <select style={smallSelect} value={editFormData.homeTeam} onChange={e => setEditFormData({...editFormData, homeTeam: e.target.value})}>
                      {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <select style={smallSelect} value={editFormData.awayTeam} onChange={e => setEditFormData({...editFormData, awayTeam: e.target.value})}>
                      {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <input style={smallInput} type="time" value={editFormData.time} onChange={e => setEditFormData({...editFormData, time: e.target.value})} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => saveEdit(f.id)} style={confirmBtn}><Check size={18}/></button>
                      <button onClick={() => setEditingId(null)} style={cancelBtn}><X size={18}/></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={fixtureInfoMain}>
                      <div style={statusBadge(f.status)}>{f.status}</div>
                      <div style={timeBox}>
                        <Clock size={14} /> {f.time}
                      </div>
                      <div style={teamDisplay}>
                        <span style={teamName}>{f.homeTeam}</span>
                        <span style={vsCircle}>VS</span>
                        <span style={teamName}>{f.awayTeam}</span>
                      </div>
                    </div>

                    <div style={fixtureMeta}>
                      <span style={metaItem}><MapPin size={12} /> {f.venue}</span>
                      <span style={metaItem}><Calendar size={12} /> {f.date}</span>
                    </div>

                    <div style={actionGroup}>
                      <button onClick={() => { setEditingId(f.id); setEditFormData(f); }} style={editBtn}><Edit2 size={16}/></button>
                      <button onClick={async () => { if(window.confirm("Permanently delete fixture?")) { await deleteDoc(doc(db, "fixtures", f.id)); fetchData(); } }} style={deleteBtn}><Trash2 size={16}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

// Styles Update
const loaderContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#1e40af', fontWeight: 800, gap: '15px' };
const formStyle = { background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '50px' };
const headerStyle = { color: '#1e40af', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' };
const inputGrid = { display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '20px', marginBottom: '20px' };
const matchInputRow = { display: 'flex', alignItems: 'center', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' };
const labelStyle = { fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '8px', marginLeft: '4px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600, outline: 'none' };
const selectStyle = { ...inputStyle, appearance: 'none', background: 'white' };
const submitBtnStyle = { background: '#1e40af', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', transition: '0.2s' };

const matchdayHeader = { display: 'flex', alignItems: 'center', marginBottom: '20px' };
const badgeStyle = { background: '#1e40af', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' };

const fixtureCardStyle = { background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', border: '1px solid #f1f5f9', transition: '0.2s' };
const editCardStyle = { ...fixtureCardStyle, borderColor: '#1e40af', background: '#eff6ff' };

const fixtureInfoMain = { display: 'flex', alignItems: 'center', gap: '20px', flex: 2 };
const statusBadge = (status) => ({ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', background: status === 'upcoming' ? '#fef9c3' : '#dcfce7', color: status === 'upcoming' ? '#854d0e' : '#166534' });
const timeBox = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 800, color: '#1e40af', minWidth: '80px' };
const teamDisplay = { display: 'flex', alignItems: 'center', gap: '15px' };
const teamName = { fontWeight: 800, fontSize: '1rem', color: '#0f172a' };
const vsCircle = { fontSize: '0.65rem', fontWeight: 900, color: '#cbd5e1', background: '#f8fafc', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid #f1f5f9' };

const fixtureMeta = { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '1px solid #f1f5f9', paddingLeft: '20px' };
const metaItem = { fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' };

const actionGroup = { display: 'flex', gap: '10px', marginLeft: '20px' };
const editBtn = { border: 'none', background: '#f1f5f9', color: '#64748b', padding: '8px', borderRadius: '8px', cursor: 'pointer' };
const deleteBtn = { ...editBtn, color: '#ef4444' };

const confirmBtn = { background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' };
const cancelBtn = { background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' };
const editModeGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr auto', gap: '12px', width: '100%', alignItems: 'center' };
const smallSelect = { padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600 };
const smallInput = { ...smallSelect };
const emptyStateStyle = { textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#cbd5e1' };

export default FixturesManager;