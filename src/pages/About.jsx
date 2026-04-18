import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Users, Target, Eye, ShieldCheck, Loader2, Shield, 
  History, Heart, Globe, X, User, Flag, Briefcase, 
  Wallet, UserCheck, Star, Sparkles, Trophy, ChevronRight
} from 'lucide-react';

const About = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedTeams = teamsData.sort((a, b) => a.name.localeCompare(b.name));
        setTeams(sortedTeams);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="about-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .about-page { background: #f8fafc; min-height: 100vh; padding: 140px 5% 100px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; }
        .container { max-width: 1100px; margin: 0 auto; }
        
        /* Header Section */
        .section-header { text-align: center; margin-bottom: 70px; }
        .section-header h1 { font-size: clamp(2.5rem, 7vw, 4rem); color: #1e3a8a; font-weight: 800; letter-spacing: -2px; margin: 0; }
        .header-underline { width: 60px; height: 5px; background: #facc15; margin: 20px auto; border-radius: 10px; }

        /* History Box */
        .history-box {
          background: white; border-radius: 40px; padding: 60px;
          margin-bottom: 80px; border: 1px solid #e2e8f0;
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        /* Feature Cards */
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 80px; }
        .feature-card { 
          background: white; padding: 45px; border-radius: 35px; border: 1px solid #e2e8f0; 
          text-align: center; transition: 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .feature-card:hover { transform: translateY(-5px); border-color: #facc15; }

        /* Teams Grid */
        .teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; margin-bottom: 100px; }
        .team-card { 
          background: white; padding: 35px 25px; border-radius: 30px; 
          border: 1px solid #e2e8f0; text-align: center; cursor: pointer; transition: 0.3s ease; 
        }
        .team-card:hover { transform: translateY(-8px); border-color: #1e3a8a; box-shadow: 0 15px 35px rgba(30,58,138,0.1); }
        .team-logo-container { height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }

        /* Social Impact */
        .impact-section { 
          background: #1e3a8a; color: white; border-radius: 50px; padding: 80px 60px; 
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; 
          border-bottom: 12px solid #facc15; position: relative; overflow: hidden;
        }
        .impact-card { background: rgba(255,255,255,0.08); padding: 35px; border-radius: 32px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }

        /* Modal */
        .modal-overlay { 
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); 
          display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; 
        }
        .modal-content { 
          background: white; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto;
          border-radius: 45px; padding: 50px; position: relative; border-top: 12px solid #1e3a8a;
          animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modal-content::-webkit-scrollbar { display: none; }

        .roles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 30px 0; }
        .role-badge {
          background: #f8fafc; padding: 20px; border-radius: 24px; border: 1px solid #e2e8f0;
          display: flex; align-items: center; gap: 14px;
        }
        .role-badge div span { display: block; font-weight: 800; color: #1e293b; font-size: 0.95rem; }
        .role-badge div small { display: block; color: #94a3b8; font-weight: 700; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; }

        @media (max-width: 900px) { 
          .history-box, .impact-section { grid-template-columns: 1fr; text-align: center; padding: 40px; }
          .roles-grid { grid-template-columns: 1fr; }
          .section-header h1 { font-size: 2.8rem; }
        }
      `}</style>

      <div className="container">
        {/* HEADER */}
        <header className="section-header">
          <span style={{ color: '#facc15', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.9rem' }}>Since 2024</span>
          <h1>The Spirit of Ndama</h1>
          <div className="header-underline"></div>
          <p className="header-description">
            The St. Jerome Alumni League is a premier community dedicated to uniting 
            former students through professional sporting excellence, lifelong fellowship, and shared heritage.
          </p>
        </header>

        {/* HISTORY */}
        <div className="history-box">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <History size={40} color="#facc15" />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>Our Journey</h2>
            </div>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.7 }}>
              What started as a casual reunion on the pitch has evolved into a fully structured, 
              professional league that preserves the brotherhood formed at St. Jerome.
            </p>
          </div>
          <div style={{ borderLeft: '4px solid #facc15', paddingLeft: '40px' }}>
            <div style={{ marginBottom: '30px' }}>
              <span style={{ fontWeight: 900, color: '#1e3a8a', fontSize: '1.2rem', display: 'block', marginBottom: '5px' }}>March 2024</span>
              <p style={{ margin: 0, fontWeight: 600, color: '#94a3b8' }}>Inaugural Gala event held at Supremacy Lounge, establishing our foundation.</p>
            </div>
            <div>
              <span style={{ fontWeight: 900, color: '#1e3a8a', fontSize: '1.2rem', display: 'block', marginBottom: '5px' }}>August 2025</span>
              <p style={{ margin: 0, fontWeight: 600, color: '#94a3b8' }}>Official kickoff of Season One at Prime Arena, bringing structured competition to our alumni.</p>
            </div>
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="feature-grid">
          <div className="feature-card">
            <div style={{ background: '#eff6ff', width: '70px', height: '70px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
              <Target size={35} color="#1e3a8a" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '15px' }}>Our Mission</h3>
            <p style={{ color: '#64748b', fontWeight: 500, lineHeight: 1.7 }}>To foster unity, networking, and wellness among alumni through professional sporting excellence and mutual support.</p>
          </div>
          <div className="feature-card">
            <div style={{ background: '#fffbeb', width: '70px', height: '70px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
              <Eye size={35} color="#facc15" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '15px' }}>Our Vision</h3>
            <p style={{ color: '#64748b', fontWeight: 500, lineHeight: 1.7 }}>To become the most innovative alumni sports community in Uganda, connecting generations of talent digitally.</p>
          </div>
        </div>

        {/* CLUBS SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>Member Clubs</h2>
          <p style={{ fontWeight: 600, color: '#94a3b8', marginTop: '10px' }}>The pillars of our league championship</p>
        </div>

        <div className="teams-grid">
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
              <Loader2 className="animate-spin" color="#1e3a8a" size={40} />
            </div>
          ) : teams.map(team => (
            <div key={team.id} className="team-card" onClick={() => setSelectedTeam(team)}>
              <div className="team-logo-container">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} style={{ maxWidth: '90px', maxHeight: '90px', objectFit: 'contain' }} />
                ) : (
                  <Shield size={70} color="#cbd5e1" />
                )}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>{team.name}</div>
              <div style={{ marginTop: '15px', color: '#facc15', display: 'flex', justifyContent: 'center' }}>
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* IMPACT */}
        <section className="impact-section">
          <div style={{ zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <Sparkles size={40} color="#facc15" />
              <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>Impact to <br/> <span style={{ color: '#facc15' }}>Society.</span></h2>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.8 }}>
              Beyond the pitch, we are a force for good. We leverage our network to uplift the 
              community in Ndama and throughout Uganda.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 2 }}>
            <div className="impact-card">
              <Heart size={30} color="#facc15" style={{ marginBottom: '15px' }} />
              <h4 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '10px' }}>Alumni Welfare</h4>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.6 }}>A dedicated fund to support members during personal emergencies and celebrate life milestones.</p>
            </div>
            <div className="impact-card">
              <Globe size={30} color="#facc15" style={{ marginBottom: '15px' }} />
              <h4 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '10px' }}>Community Outreach</h4>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.6 }}>Annual drives providing sports equipment and education materials to schools in the local region.</p>
            </div>
          </div>
        </section>

        {/* MODAL */}
        {selectedTeam && (
          <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedTeam(null)} style={{ position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f8fafc', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={24} color="#1e3a8a" />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {selectedTeam.logoUrl ? (
                    <img src={selectedTeam.logoUrl} alt={selectedTeam.name} style={{ maxHeight: '120px', objectFit: 'contain' }} />
                  ) : (
                    <Shield size={100} color="#1e3a8a" />
                  )}
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e3a8a', margin: '0 0 10px 0' }}>{selectedTeam.name}</h2>
                <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '6px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Member</span>
              </div>

              <div className="roles-grid">
                <div className="role-badge">
                  <UserCheck size={24} color="#1e3a8a" />
                  <div><small>Chairman</small><span>{selectedTeam.chairman || 'Not Set'}</span></div>
                </div>
                <div className="role-badge">
                  <Briefcase size={24} color="#1e3a8a" />
                  <div><small>Head Coach</small><span>{selectedTeam.coach || 'Not Set'}</span></div>
                </div>
                <div className="role-badge">
                  <Flag size={24} color="#1e3a8a" />
                  <div><small>Captain</small><span>{selectedTeam.captain || 'Not Set'}</span></div>
                </div>
                <div className="role-badge">
                  <Wallet size={24} color="#1e3a8a" />
                  <div><small>Treasurer</small><span>{selectedTeam.treasurer || 'Not Set'}</span></div>
                </div>
                <div className="role-badge" style={{ gridColumn: '1 / -1', background: '#fffbeb', border: '1px solid #fef3c7' }}>
                  <Star size={24} color="#facc15" />
                  <div><small>League Executive Representative</small><span style={{ color: '#92400e' }}>{selectedTeam.rep || 'Not Set'}</span></div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '32px', border: '1px solid #e2e8f0', marginBottom: '35px' }}>
                <p style={{ color: '#64748b', lineHeight: 1.8, fontWeight: 600, fontSize: '1rem', margin: 0 }}>
                  {selectedTeam.description || `${selectedTeam.name} is a vital club within the St. Jerome community, embodying the values of sportsmanship and alumni unity.`}
                </p>
              </div>

              <button 
                onClick={() => setSelectedTeam(null)} 
                style={{ width: '100%', padding: '22px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(30,58,138,0.2)' }}
              >
                CLOSE PROFILE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;