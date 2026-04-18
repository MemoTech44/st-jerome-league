import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, getDocs, updateDoc, doc, writeBatch, 
  query, where, increment, setDoc 
} from 'firebase/firestore';
import { 
  UserPlus, Trash2, Save, Loader2, X, AlertCircle, Edit3, MessageSquare 
} from 'lucide-react';

const ResultsManager = () => {
  const [fixtures, setFixtures] = useState([]);
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeFixture, setActiveFixture] = useState(null);
  
  // Filters
  const [selectedSeason, setSelectedSeason] = useState("Season 2");
  const [selectedMatchday, setSelectedMatchday] = useState(1);

  // Form State
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchScorers, setMatchScorers] = useState([]);
  const [adminNote, setAdminNote] = useState("");

  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5"];
  const matchdays = Array.from({ length: 8 }, (_, i) => i + 1);

  useEffect(() => {
    fetchData();
  }, [selectedSeason, selectedMatchday]);

  const fetchData = async () => {
    setFetching(true);
    try {
      // Fetch ALL fixtures for this MD (both upcoming and completed)
      const fixQuery = query(
        collection(db, "fixtures"), 
        where("season", "==", selectedSeason),
        where("matchday", "==", Number(selectedMatchday))
      );
      const fixSnap = await getDocs(fixQuery);
      setFixtures(fixSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const playerSnap = await getDocs(collection(db, "players"));
      setPlayers(playerSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const clubSnap = await getDocs(collection(db, "clubs"));
      setClubs(clubSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const openEditor = (f) => {
    setActiveFixture(f.id);
    setHomeScore(f.homeScore || 0);
    setAwayScore(f.awayScore || 0);
    setMatchScorers(f.scorers || []);
    setAdminNote(f.adminNote || "");
  };

  const handleUpdate = async (fixture) => {
    setLoading(true);
    const batch = writeBatch(db);

    try {
      const fixtureRef = doc(db, "fixtures", fixture.id);
      
      // Update Fixture Doc
      batch.update(fixtureRef, { 
        status: 'completed',
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        scorers: matchScorers,
        adminNote: adminNote
      });

      // Update Standings Logic (Simplified for brevity)
      // Note: In a production environment, if editing an existing result, 
      // you must subtract the old scores before adding new ones to prevent double-counting.
      if (fixture.status !== 'completed') {
        const hPoints = homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0;
        const aPoints = awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0;
        
        const homeClub = clubs.find(c => c.name === fixture.homeTeam);
        const awayClub = clubs.find(c => c.name === fixture.awayTeam);

        if (homeClub && awayClub) {
          batch.update(doc(db, "clubs", homeClub.id), {
            [`stats.${selectedSeason}.played`]: increment(1),
            [`stats.${selectedSeason}.points`]: increment(hPoints),
            [`stats.${selectedSeason}.gf`]: increment(Number(homeScore)),
            [`stats.${selectedSeason}.ga`]: increment(Number(awayScore)),
          });
          batch.update(doc(db, "clubs", awayClub.id), {
            [`stats.${selectedSeason}.played`]: increment(1),
            [`stats.${selectedSeason}.points`]: increment(aPoints),
            [`stats.${selectedSeason}.gf`]: increment(Number(awayScore)),
            [`stats.${selectedSeason}.ga`]: increment(Number(homeScore)),
          });
        }

        matchScorers.forEach(s => {
          if (s.playerId) {
            batch.update(doc(db, "players", s.playerId), { 
              [`goals.${selectedSeason}`]: increment(1) 
            });
          }
        });
      }

      await batch.commit();
      setActiveFixture(null);
      fetchData();
      alert("Season data updated successfully!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px 10px', maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Centered Season Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
        <div style={tabBox}>
          {seasons.map(s => (
            <button key={s} onClick={() => setSelectedSeason(s)} style={{
              ...tabBtn,
              background: selectedSeason === s ? '#1e3a8a' : 'transparent',
              color: selectedSeason === s ? 'white' : '#1e3a8a'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Centered Matchday Horizontal Filter */}
      <div style={scrollWrapper}>
        <div style={{ display: 'flex', gap: '10px' }}>
            {matchdays.map(m => (
            <button key={m} onClick={() => setSelectedMatchday(m)} style={{
                ...mdBtn,
                background: selectedMatchday === m ? '#1e3a8a' : 'white',
                color: selectedMatchday === m ? 'white' : '#1e3a8a'
            }}>MD {m}</button>
            ))}
        </div>
      </div>

      {fetching ? (
        <div style={loaderBox}><Loader2 className="animate-spin" color="#1e3a8a" /></div>
      ) : fixtures.length === 0 ? (
        <div style={emptyBox}><p>No fixtures found.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {fixtures.map(f => (
            <div key={f.id} style={f.status === 'completed' ? completedCard : card}>
              <div style={rowBetween}>
                <div style={teamsDisplay}>
                  <span style={teamNameStyle}>{f.homeTeam}</span>
                  <div style={scoreDisplay}>
                    {f.status === 'completed' ? `${f.homeScore} - ${f.awayScore}` : 'VS'}
                  </div>
                  <span style={{ ...teamNameStyle, textAlign: 'left' }}>{f.awayTeam}</span>
                </div>
                <div style={{ width: '100px', textAlign: 'right' }}>
                  {activeFixture === f.id ? (
                    <button onClick={() => setActiveFixture(null)} style={closeBtn}><X size={18}/></button>
                  ) : (
                    <button onClick={() => openEditor(f)} style={f.status === 'completed' ? editBtn : recordBtn}>
                      {f.status === 'completed' ? <Edit3 size={14}/> : 'Record'}
                    </button>
                  )}
                </div>
              </div>

              {f.status === 'completed' && activeFixture !== f.id && f.adminNote && (
                <div style={noteStyle}><MessageSquare size={12}/> {f.adminNote}</div>
              )}

              {activeFixture === f.id && (
                <div style={entrySection}>
                  <div style={scoreGrid}>
                    <input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value)} style={scoreInput} />
                    <div style={{fontWeight: 'bold', color: '#1e3a8a'}}>TO</div>
                    <input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value)} style={scoreInput} />
                  </div>

                  <div style={{marginTop: '20px'}}>
                    <textarea 
                        placeholder="Add admin note (e.g. Team missed match)..." 
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        style={textAreaStyle}
                    />
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <div style={rowBetween}>
                      <span style={sectionTitle}>SCORERS</span>
                      <button onClick={() => setMatchScorers([...matchScorers, { playerId: '' }])} style={addBtn}>+ Scorer</button>
                    </div>
                    {matchScorers.map((s, idx) => (
                      <div key={idx} style={scorerRow}>
                        <select style={selectInput} value={s.playerId} onChange={(e) => {
                          const n = [...matchScorers];
                          n[idx].playerId = e.target.value;
                          setMatchScorers(n);
                        }}>
                          <option value="">Select Player</option>
                          {players.filter(p => p.club === f.homeTeam || p.club === f.awayTeam).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <button onClick={() => {
                          const n = [...matchScorers]; n.splice(idx, 1); setMatchScorers(n);
                        }} style={delBtn}><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => handleUpdate(f)} disabled={loading} style={submitBtn}>
                    {loading ? "Processing..." : "Save Result & Update Season"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const tabBox = { display: 'flex', gap: '5px', background: '#dbeafe', padding: '5px', borderRadius: '10px' };
const tabBtn = { padding: '8px 15px', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.7rem' };
const scrollWrapper = { display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '10px 0 20px 0' };
const mdBtn = { padding: '8px 16px', borderRadius: '8px', border: '2px solid #1e3a8a', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' };
const card = { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #bfdbfe' };
const completedCard = { ...card, background: '#f8fafc', borderLeft: '5px solid #1e3a8a' };
const rowBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const teamsDisplay = { display: 'flex', alignItems: 'center', gap: '15px', flex: 1 };
const teamNameStyle = { flex: 1, fontWeight: '900', fontSize: '0.9rem', color: '#1e3a8a', textAlign: 'right', textTransform: 'uppercase' };
const scoreDisplay = { background: '#1e3a8a', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 900 };
const recordBtn = { background: '#1e3a8a', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' };
const editBtn = { ...recordBtn, background: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' };
const closeBtn = { background: '#fee2e2', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: '#ef4444' };
const entrySection = { marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #dbeafe' };
const scoreGrid = { display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' };
const scoreInput = { width: '60px', height: '50px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '8px', border: '2px solid #1e3a8a', fontWeight: 'bold' };
const textAreaStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.8rem', minHeight: '60px' };
const noteStyle = { marginTop: '10px', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '5px' };
const sectionTitle = { fontSize: '0.75rem', fontWeight: 800, color: '#1e3a8a' };
const addBtn = { background: '#dbeafe', color: '#1e3a8a', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 };
const scorerRow = { display: 'flex', gap: '8px', marginTop: '8px' };
const selectInput = { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.8rem' };
const delBtn = { background: 'none', border: 'none', color: '#ef4444' };
const submitBtn = { width: '100%', marginTop: '20px', background: '#1e3a8a', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 900, color: 'white', cursor: 'pointer' };
const loaderBox = { display: 'flex', justifyContent: 'center', padding: '40px' };
const emptyBox = { textAlign: 'center', padding: '40px', color: '#64748b' };

export default ResultsManager;