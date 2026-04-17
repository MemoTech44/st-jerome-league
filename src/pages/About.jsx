import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Users, Target, Eye, ShieldCheck, 
  Loader2, Trophy, UserCircle, Shield, 
  History, Calendar, Sparkles
} from 'lucide-react';

const About = () => {
  const [teams, setTeams] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeams(teamsData.sort((a, b) => a.name.localeCompare(b.name)));

        const q = query(collection(db, "members"), orderBy("name", "asc"));
        const committeeSnapshot = await getDocs(q);
        setCommittee(committeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching league data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .about-page { 
          background-color: #f8fafc; 
          min-height: 100vh; 
          padding: 120px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #0f172a; 
        }
        .container { max-width: 1200px; margin: 0 auto; }
        
        /* --- HERO --- */
        .hero-section { text-align: center; margin-bottom: 100px; }
        .motto-badge { 
          background: #1e40af; 
          color: white; 
          padding: 10px 28px; 
          border-radius: 50px; 
          font-size: 0.85rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          margin-bottom: 30px; 
          display: inline-block;
          box-shadow: 0 10px 20px rgba(30, 64, 175, 0.2);
        }
        .about-title { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(3rem, 8vw, 5.5rem); 
          font-weight: 900; 
          letter-spacing: -4px; 
          color: #0f172a; 
          margin: 0; 
          line-height: 0.9; 
        }
        .accent-blue { color: #1e40af; text-shadow: 2px 2px 0px #facc15; }

        /* --- HISTORY TIMELINE --- */
        .history-section { margin-bottom: 120px; }
        .timeline { position: relative; max-width: 800px; margin: 40px auto; padding-left: 30px; border-left: 4px solid #e2e8f0; }
        .timeline-item { position: relative; margin-bottom: 50px; }
        .timeline-dot { 
            position: absolute; left: -39px; top: 0; width: 14px; height: 14px; 
            background: #1e40af; border: 4px solid #fff; border-radius: 50%; 
            box-shadow: 0 0 0 4px #1e40af;
        }
        .history-card { 
            background: white; padding: 30px; border-radius: 24px; 
            box-shadow: 0 15px 30px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
        }

        /* --- CARDS & GRIDS --- */
        .story-box {
          background: white; border-radius: 40px; padding: 60px;
          display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px;
          margin-bottom: 100px; align-items: center;
          border: 1px solid #e2e8f0;
        }
        .mv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-bottom: 120px; }
        .mv-card { 
          background: white; padding: 50px; border-radius: 35px; 
          border: 1px solid #e2e8f0; position: relative; overflow: hidden;
        }
        .mv-card::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: #1e40af; }
        .mv-card.vision::before { background: #facc15; }

        /* --- TEAM PILLS --- */
        .team-pill { 
          background: #fff; padding: 25px; border-radius: 30px; 
          border: 1px solid #e2e8f0; font-weight: 800; 
          display: flex; flex-direction: column; align-items: center; 
          width: 180px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .team-pill:hover { transform: translateY(-12px) scale(1.05); border-color: #1e40af; box-shadow: 0 25px 50px rgba(30,64,175,0.1); }

        /* --- EXECUTIVE SECTION --- */
        .exec-wrap { 
          background: #0f172a; color: white; border-radius: 60px; 
          padding: 100px 50px; text-align: center; overflow: hidden;
        }
        .member-photo { 
          width: 160px; height: 160px; border-radius: 50px; 
          object-fit: cover; border: 5px solid #1e40af; 
          margin-bottom: 25px; background: #1e293b; 
          transition: 0.5s;
        }
        .member-box:hover .member-photo { border-color: #facc15; border-radius: 30px; }

        @media (max-width: 900px) {
          .story-box, .mv-grid { grid-template-columns: 1fr; padding: 30px; }
          .about-title { font-size: 3.5rem; }
          .exec-wrap { border-radius: 40px; padding: 60px 20px; }
        }
      `}</style>

      <div className="about-page">
        <div className="container">
          
          <header className="hero-section">
            <div className="motto-badge">Est. 2023 • The St. Jerome Spirit</div>
            <h1 className="about-title">
              Our <span className="accent-blue">History</span>,<br/>
              Your <span style={{color: '#facc15'}}>Future.</span>
            </h1>
          </header>

          {/* HISTORY SECTION */}
          <section className="history-section">
            <div style={{textAlign: 'center', marginBottom: '40px'}}>
               <History size={40} color="#1e40af" style={{marginBottom: '10px'}}/>
               <h2 style={{fontSize: '2.5rem', fontWeight: 900}}>The Journey</h2>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="history-card">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#1e40af', fontWeight: 800, marginBottom: '10px'}}>
                    <Calendar size={18}/> AUGUST 2023
                  </div>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px'}}>The Grand Launch (Galla)</h3>
                  <p style={{color: '#64748b', lineHeight: 1.6, fontWeight: 500}}>
                    The league was born out of a spectacular "Galla" event that brought together over 200 alumni. 
                    It wasn't just about football; it was a celebration of our roots at St. Jerome Secondary School Ndama. 
                    This day set the foundation for what is now the most competitive alumni league in the region.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="history-card">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#1e40af', fontWeight: 800, marginBottom: '10px'}}>
                    <Sparkles size={18}/> JANUARY 2024
                  </div>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px'}}>Digital Evolution</h3>
                  <p style={{color: '#64748b', lineHeight: 1.6, fontWeight: 500}}>
                    Transitioning from a casual gathering to a professionalized league, we introduced real-time 
                    stat tracking, registered match officials, and our first official season structure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="story-box">
            <div className="story-text">
              <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px'}}>Revolutionizing Alumni <span className="accent-blue">Sports</span></h2>
              <p style={{fontSize: '1.2rem', lineHeight: 1.8, color: '#475569', fontWeight: 500}}>The St. Jerome League is a community-driven initiative established to bridge the gap between alumni generations. We provide a high-stakes competitive environment where the spirit of Ndama never fades.</p>
              <p style={{fontSize: '1.2rem', lineHeight: 1.8, color: '#475569', fontWeight: 500, marginTop: '20px'}}>Managed with absolute transparency, we ensure every kickoff contributes to the physical wellness and professional networking of our members.</p>
            </div>
            
            <div style={{background: '#f8fafc', padding: '40px', borderRadius: '30px', border: '1px solid #e2e8f0'}}>
              <Trophy size={48} color="#facc15" style={{marginBottom: '20px'}}/>
              <h3 style={{fontWeight: 800, fontSize: '1.5rem', marginBottom: '20px'}}>League Standards</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontWeight: 700, color: '#1e293b' }}>
                <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={22} color="#1e40af"/> Pro-Certified Officials</li>
                <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={22} color="#1e40af"/> Live Digital Scoreboards</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={22} color="#1e40af"/> Alumni Welfare Fund</li>
              </ul>
            </div>
          </section>

          <div className="mv-grid">
            <div className="mv-card">
              <Target size={40} color="#1e40af" style={{marginBottom: '20px'}}/>
              <h3 style={{fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px'}}>Our Mission</h3>
              <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.7, fontSize: '1.1rem' }}>To provide a professionalized sports environment that fosters discipline, promotes healthy competition, and builds lifelong community bonds across generations of Ndama alumni.</p>
            </div>
            
            <div className="mv-card vision">
              <Eye size={40} color="#facc15" style={{marginBottom: '20px'}}/>
              <h3 style={{fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px'}}>Our Vision</h3>
              <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.7, fontSize: '1.1rem' }}>To become the gold standard for alumni sports leagues in Africa, recognized for our digital innovation, community impact, and athletic excellence.</p>
            </div>
          </div>

          <section className="teams-section" style={{textAlign: 'center', marginBottom: '120px'}}>
            <h2 style={{ fontWeight: 900, fontSize: '3rem', marginBottom: '10px' }}>The <span className="accent-blue">Battalion</span></h2>
            <p style={{color: '#64748b', fontWeight: 700, marginBottom: '50px'}}>Clubs competing for glory in the current season.</p>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px'}}>
              {loading ? <Loader2 className="animate-spin" color="#1e40af" size={40} /> : teams.map(team => (
                <div key={team.id} className="team-pill">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} style={{width: '80px', height: '80px', objectFit: 'contain', marginBottom: '15px'}} />
                  ) : (
                    <div style={{ background: '#f1f5f9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                      <Shield size={40} color="#cbd5e1" />
                    </div>
                  )}
                  <span style={{fontSize: '1rem', textAlign: 'center'}}>{team.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="exec-wrap">
            <h2 style={{ fontWeight: 900, fontSize: '3rem', marginBottom: '10px' }}>The Board of <span style={{ color: '#facc15' }}>Governors.</span></h2>
            <p style={{ marginBottom: '60px', opacity: 0.8, fontSize: '1.1rem' }}>The leadership team ensuring the league's integrity and growth.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px' }}>
              {loading ? <Loader2 className="animate-spin" color="#facc15" size={40} /> : committee.map((member) => (
                <div key={member.id} className="member-box">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="member-photo" />
                  ) : (
                    <div className="member-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                      <UserCircle size={100} color="#1e293b" />
                    </div>
                  )}
                  <div style={{ color: '#facc15', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>{member.position}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '10px' }}>{member.name}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default About;