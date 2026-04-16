import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, getDocs, updateDoc, doc, writeBatch, 
  query, where, increment, addDoc 
} from 'firebase/firestore';
import { Trophy, UserPlus, Trash2, Save, Loader2, X, AlertCircle } from 'lucide-react';

const ResultsManager = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFixture, setActiveFixture] = useState(null);

  // Score and Scorers State
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchScorers, setMatchScorers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Only fetch fixtures that haven't been played yet
    const fixSnap = await getDocs(query(collection(db, "fixtures"), where("status", "==", "upcoming")));
    setUpcoming(fixSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    
    const playerSnap = await getDocs(collection(db, "players"));
    setPlayers(playerSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    const clubSnap = await getDocs(collection(db, "clubs"));
    setClubs(clubSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleUpdate = async (fixture) => {
    if (!window.confirm("Submit final result? This will update league standings and the public Results page.")) return;
    setLoading(true);
    const batch = writeBatch(db);

    try {
      // 1. Mark Fixture as completed
      const fixtureRef = doc(db, "fixtures", fixture.id);
      batch.update(fixtureRef, { status: 'completed' });

      // 2. CREATE the Result Document for the Main Website
      const resultsRef = doc(collection(db, "results")); // Auto-generate ID
      batch.set(resultsRef, {
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        date: fixture.date,
        time: "FT", // Mark as Full Time
        venue: fixture.venue,
        matchday: fixture.matchday,
        scorers: matchScorers,
        createdAt: new Date()
      });

      // 3. Logic for Standings
      const hPoints = homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0;
      const aPoints = awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0;

      const homeClub = clubs.find(c => c.name === fixture.homeTeam);
      const awayClub = clubs.find(c => c.name === fixture.awayTeam);

      if (homeClub && awayClub) {
        const homeClubRef = doc(db, "clubs", homeClub.id);
        const awayClubRef = doc(db, "clubs", awayClub.id);

        batch.update(homeClubRef, {
          played: increment(1),
          won: increment(homeScore > awayScore ? 1 : 0),
          drawn: increment(homeScore === awayScore ? 1 : 0),
          lost: increment(homeScore < awayScore ? 1 : 0),
          gf: increment(Number(homeScore)),
          ga: increment(Number(awayScore)),
          gd: increment(Number(homeScore - awayScore)),
          points: increment(hPoints)
        });

        batch.update(awayClubRef, {
          played: increment(1),
          won: increment(awayScore > homeScore ? 1 : 0),
          drawn: increment(awayScore === homeScore ? 1 : 0),
          lost: increment(awayScore < homeScore ? 1 : 0),
          gf: increment(Number(awayScore)),
          ga: increment(Number(homeScore)),
          gd: increment(Number(awayScore - homeScore)),
          points: increment(aPoints)
        });
      }

      // 4. Update Player Goals
      matchScorers.forEach(scorer => {
        if (scorer.playerId) {
          const playerRef = doc(db, "players", scorer.playerId);
          batch.update(playerRef, { goals: increment(1) });
        }
      });

      await batch.commit();
      
      // Reset State
      setActiveFixture(null);
      setHomeScore(0);
      setAwayScore(0);
      setMatchScorers([]);
      fetchData();
      alert("Result successfully posted to website!");
    } catch (error) {
      console.error(error);
      alert("Error: Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e40af', margin: 0 }}>
          <Trophy size={28} /> League Management
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Finalize matches to update the public Table and Results.</p>
      </header>
      
      {upcoming.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px' }}>
          <AlertCircle size={32} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>No upcoming fixtures found.</p>
        </div>
      ) : (
        upcoming.map(f => (
          <div key={f.id} style={activeFixture === f.id ? activeCardStyle : cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 900, letterSpacing: '1px' }}>MATCHDAY {f.matchday}</span>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>{f.homeTeam} <span style={{color: '#cbd5e1', margin: '0 8px'}}>VS</span> {f.awayTeam}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{f.venue} • {f.date}</div>
              </div>
              
              {!activeFixture && (
                <button onClick={() => {
                  setActiveFixture(f.id);
                  setHomeScore(0);
                  setAwayScore(0);
                }} style={entryBtnStyle}>Record Score</button>
              )}
              {activeFixture === f.id && <button onClick={() => setActiveFixture(null)} style={closeBtnStyle}><X size={20}/></button>}
            </div>

            {activeFixture === f.id && (
              <div style={{ marginTop: '25px', borderTop: '1px dashed #e2e8f0', paddingTop: '25px' }}>
                {/* Score Input */}
                <div style={scoreGrid}>
                  <div style={{ textAlign: 'center' }}>
                    <label style={labelStyle}>{f.homeTeam}</label>
                    <input type="number" min="0" value={homeScore} onChange={e => setHomeScore(e.target.value)} style={scoreInput} />
                  </div>
                  <div style={{ alignSelf: 'center', paddingTop: '20px', fontWeight: 900, color: '#1e40af', fontSize: '1.5rem' }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <label style={labelStyle}>{f.awayTeam}</label>
                    <input type="number" min="0" value={awayScore} onChange={e => setAwayScore(e.target.value)} style={scoreInput} />
                  </div>
                </div>

                {/* Scorer Logic remained same but styled better */}
                <div style={{ marginTop: '30px' }}>
                   {/* ... (Your scorer mapping logic is already solid) ... */}
                   <button onClick={() => setMatchScorers([...matchScorers, { playerId: '' }])} style={addScorerBtn}>
                     <UserPlus size={14}/> Add Scorer
                   </button>
                   {matchScorers.map((s, idx) => (
                     <div key={idx} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                       <select 
                         style={selectStyle}
                         onChange={(e) => {
                           const newScorers = [...matchScorers];
                           const p = players.find(player => player.id === e.target.value);
                           newScorers[idx].playerId = e.target.value;
                           newScorers[idx].playerName = p?.name;
                           setMatchScorers(newScorers);
                         }}
                       >
                         <option value="">Select Scorer</option>
                         {players.filter(p => p.club === f.homeTeam || p.club === f.awayTeam).map(p => (
                           <option key={p.id} value={p.id}>{p.name} ({p.club})</option>
                         ))}
                       </select>
                       <button onClick={() => {
                         const n = [...matchScorers]; n.splice(idx, 1); setMatchScorers(n);
                       }} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                     </div>
                   ))}
                </div>

                <button 
                  className="btn-primary" 
                  onClick={() => handleUpdate(f)} 
                  disabled={loading}
                  style={saveBtnStyle}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Push to Public Results</>}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

// New/Updated Styles for better branding
const cardStyle = { background: 'white', padding: '25px', borderRadius: '16px', marginBottom: '15px', border: '1px solid #e2e8f0', transition: '0.2s' };
const activeCardStyle = { ...cardStyle, borderColor: '#1e40af', boxShadow: '0 12px 20px -5px rgba(30, 64, 175, 0.15)' };
const labelStyle = { fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '10px' };
const entryBtnStyle = { background: '#1e40af', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' };
const scoreInput = { width: '90px', fontSize: '2.2rem', textAlign: 'center', fontWeight: '900', padding: '12px', borderRadius: '12px', border: '2px solid #f1f5f9', color: '#1e40af', outline: 'none' };
const scoreGrid = { display: 'flex', justifyContent: 'center', gap: '30px' };
const saveBtnStyle = { width: '100%', marginTop: '30px', background: '#facc15', color: '#1e40af', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 800, display: 'flex', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '1rem' };
const selectStyle = { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 };
const addScorerBtn = { background: '#f0f4ff', color: '#1e40af', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' };
const closeBtnStyle = { border: 'none', background: '#f1f5f9', color: '#64748b', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default ResultsManager;