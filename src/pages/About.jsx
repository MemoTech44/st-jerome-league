import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Users, Target, Eye, ShieldCheck, 
  Loader2, Trophy, Shield, 
  History, Calendar, Sparkles, Heart, Globe, X
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .about-page { 
          background-color: #f1f5f9; 
          min-height: 100vh; 
          padding: 140px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #1e293b; 
        }
        .container { max-width: 1100px; margin: 0 auto; }
        
        /* --- HEADER --- */
        .header-box { text-align: center; margin-bottom: 60px; }
        .header-box h1 { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(2.5rem, 7vw, 4.5rem); 
          letter-spacing: -2px; 
          color: #1e40af; 
          margin-bottom: 5px;
          font-weight: 800;
        }
        .motto {
          color: #facc15;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.95rem;
          margin-top: 5px;
          display: block;
        }
        .header-description {
          max-width: 750px;
          margin: 30px auto 0;
          font-size: 1.15rem;
          line-height: 1.6;
          color: #475569;
          font-weight: 500;
        }

        /* --- CENTERED INLINE HEADINGS --- */
        .centered-inline-heading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        .centered-inline-heading h2, .centered-inline-heading h3 {
          margin: 0;
        }

        /* --- HISTORY SECTION --- */
        .history-box {
          background: white;
          border-radius: 40px;
          padding: 60px 40px;
          margin-bottom: 100px;
          border: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }
        .history-content h2 { font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 800; color: #1e40af; }
        .timeline { border-left: 3px solid #facc15; padding-left: 30px; position: relative; }
        .timeline-item { margin-bottom: 30px; position: relative; }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -38.5px;
          top: 5px;
          width: 14px;
          height: 14px;
          background: #1e40af;
          border: 3px solid #facc15;
          border-radius: 50%;
        }
        .timeline-date { font-weight: 800; color: #1e40af; font-size: 1.1rem; display: block; }
        .timeline-text { color: #475569; font-weight: 600; }

        /* --- FEATURE CARDS --- */
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 100px; }
        .feature-card { background: white; padding: 40px; border-radius: 30px; border: 1px solid #e2e8f0; transition: 0.3s ease; text-align: center; }
        .feature-card:hover { transform: translateY(-5px); border-color: #facc15; }
        .feature-card h3 { font-size: 1.8rem; font-weight: 800; color: #0f172a; }
        
        .section-title { font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 50px; color: #1e40af; }
        
        .teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 25px; margin-bottom: 100px; }
        .team-card { background: white; padding: 30px; border-radius: 24px; border: 1px solid #e2e8f0; text-align: center; cursor: pointer; transition: 0.3s ease; }
        .team-card:hover { transform: translateY(-8px); border-color: #1e40af; }

        .impact-section { background: #1e40af; color: white; border-radius: 40px; padding: 80px 40px; margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; border-bottom: 8px solid #facc15; }
        .impact-card { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 24px; margin-bottom: 20px; text-align: center; }
        .impact-card h4 { font-weight: 800; fontSize: 1.3rem; margin-bottom: 10px; color: #facc15; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; }
        .modal-content { background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 50px; position: relative; text-align: center; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-top: 10px solid #1e40af; }

        @media (max-width: 900px) { 
          .history-box, .impact-section { grid-template-columns: 1fr; }
          .history-content { text-align: center; }
          .about-page { padding-top: 100px; }
        }
      `}</style>

      <div className="about-page">
        <div className="container">
          
          <header className="header-box">
            <h1>The Spirit of Ndama</h1>
            <span className="motto">Connecting Generations</span>
            <p className="header-description">
              The St. Jerome Alumni League is a premier sporting community dedicated to uniting 
              old students through competition, fellowship, and a shared passion for our alma mater.
            </p>
          </header>

          {/* HISTORY SECTION */}
          <div className="history-box">
            <div className="history-content">
              <div className="centered-inline-heading">
                <History size={40} color="#facc15" />
                <h2>Our Brief History</h2>
              </div>
              <p style={{ color: '#475569', fontWeight: 500, lineHeight: 1.7 }}>
                What started as a simple idea to bring old friends back together has grown into 
                a structured league that bridges the gap between different generations of students.
              </p>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-date">March 2024</span>
                <span className="timeline-text">Inaugural 1st Gala event held at Ndama, setting the foundation for the league.</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">August 2025</span>
                <span className="timeline-text">Official kickoff of Season One, featuring competitive league matches.</span>
              </div>
              <div className="timeline-item" style={{ marginBottom: 0 }}>
                <span className="timeline-date">February 2026</span>
                <span className="timeline-text">Successful completion of Season One, crowning our first league champions.</span>
              </div>
            </div>
          </div>

          <div className="feature-grid">
             <div className="feature-card">
                <div className="centered-inline-heading">
                   <Target size={35} color="#1e40af" />
                   <h3>Our Mission</h3>
                </div>
                <p>To foster unity and physical wellness among St. Jerome alumni through professionalized sporting excellence and networking.</p>
             </div>
             <div className="feature-card">
                <div className="centered-inline-heading">
                   <Eye size={35} color="#facc15" />
                   <h3>Our Vision</h3>
                </div>
                <p>To become the most impactful and digitally innovative alumni sports community in Uganda, connecting generations of talent.</p>
             </div>
          </div>

          <h2 className="section-title">The Competitors</h2>
          <div className="teams-grid">
            {loading ? (
               <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                 <Loader2 className="animate-spin" color="#1e40af" size={40} />
               </div>
            ) : teams.map(team => (
              <div key={team.id} className="team-card" onClick={() => setSelectedTeam(team)}>
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '15px' }} />
                ) : (
                  <Shield size={60} color="#cbd5e1" style={{ marginBottom: '15px' }} />
                )}
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{team.name}</div>
              </div>
            ))}
          </div>

          <section className="impact-section">
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '20px', lineHeight: 1.1 }}>
                Impact to <br/> <span style={{ color: '#facc15' }}>Society.</span>
              </h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7, fontWeight: 500 }}>
                Beyond the pitch, we are a force for good. The St. Jerome League leverages its network to uplift the community in Ndama and across the country.
              </p>
            </div>
            <div>
               <div className="impact-card">
                  <div className="centered-inline-heading">
                    <Heart size={30} color="#facc15" />
                    <h4 style={{ margin: 0 }}>Alumni Welfare</h4>
                  </div>
                  <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>We maintain a dedicated fund to support members during emergencies and celebrate their milestones.</p>
               </div>
               <div className="impact-card">
                  <div className="centered-inline-heading">
                    <Globe size={30} color="#facc15" />
                    <h4 style={{ margin: 0 }}>Community Outreach</h4>
                  </div>
                  <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Our annual charity drives provide sports equipment and educational materials to schools in local regions.</p>
               </div>
            </div>
          </section>

        </div>

        {selectedTeam && (
          <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedTeam(null)} style={{ position: 'absolute', top: '25px', right: '25px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={30} />
              </button>
              {selectedTeam.logoUrl ? (
                <img src={selectedTeam.logoUrl} alt={selectedTeam.name} style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '20px' }} />
              ) : (
                <Shield size={100} color="#1e40af" style={{ marginBottom: '20px' }} />
              )}
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '5px', color: '#1e40af' }}>{selectedTeam.name}</h2>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '30px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                  {selectedTeam.description || `${selectedTeam.name} is a proud participant in the St. Jerome Alumni League.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default About;