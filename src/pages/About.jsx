import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Users, 
  Target, 
  Eye, 
  Award, 
  ShieldCheck, 
  Zap,
  Loader2,
  Trophy,
  UserCircle,
  Shield
} from 'lucide-react';

const About = () => {
  const [teams, setTeams] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching Clubs (Teams) - Sorted Alphabetically
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeams(teamsData.sort((a, b) => a.name.localeCompare(b.name)));

        // Fetching Executive Members
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .about-page { 
          background-color: #f1f5f9; 
          min-height: 100vh; 
          padding: 140px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #1e293b; 
        }
        .container { max-width: 1100px; margin: 0 auto; }
        
        /* --- HERO --- */
        .hero-section { text-align: center; margin-bottom: 80px; }
        .motto-badge { 
          background: #1e40af; 
          color: white; 
          padding: 8px 24px; 
          border-radius: 50px; 
          font-size: 0.8rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          margin-bottom: 25px; 
          display: inline-block; 
        }
        .about-title { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(2.5rem, 6vw, 4.5rem); 
          font-weight: 900; 
          letter-spacing: -3px; 
          color: #0f172a; 
          margin: 0; 
          line-height: 1; 
        }
        .slogan {
          font-size: 1.2rem;
          font-weight: 700;
          color: #64748b;
          margin-top: 20px;
          letter-spacing: 1px;
        }
        .accent-blue { color: #1e40af; }
        .accent-yellow { color: #facc15; }

        /* --- STORY & MISSION --- */
        .story-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; margin-bottom: 80px; align-items: center; }
        .story-text { font-size: 1.15rem; line-height: 1.8; color: #64748b; font-weight: 600; }
        
        .highlight-card { 
          background: white; 
          padding: 40px; 
          border-radius: 40px; 
          border-top: 6px solid #facc15; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.03); 
        }

        .mv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-bottom: 100px; }
        .mv-card { background: white; padding: 45px; border-radius: 35px; border: 1px solid #e2e8f0; transition: 0.3s; }
        .mv-card:hover { border-color: #1e40af; transform: translateY(-5px); }
        .mv-card h3 { font-family: 'Inter', sans-serif; font-size: 1.8rem; font-weight: 900; margin-bottom: 15px; color: #0f172a; }

        /* --- CLUBS SECTION --- */
        .teams-section { margin-bottom: 100px; text-align: center; }
        .teams-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 25px; margin-top: 40px; }
        .team-pill { 
          background: white; 
          padding: 20px; 
          border-radius: 25px; 
          border: 1px solid #e2e8f0; 
          font-weight: 800; 
          color: #0f172a; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 12px; 
          width: 160px; 
          transition: all 0.3s; 
        }
        .team-pill:hover { 
          transform: translateY(-8px); 
          border-color: #1e40af; 
          box-shadow: 0 15px 30px rgba(30, 64, 175, 0.1); 
        }
        .team-logo { width: 70px; height: 70px; object-fit: contain; }

        /* --- EXECUTIVE SECTION --- */
        .exec-container { 
          background: linear-gradient(135deg, #1e40af 0%, #0f172a 100%);
          color: white; 
          border-radius: 50px; 
          padding: 80px 40px; 
          text-align: center;
        }
        .exec-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 40px; 
          margin-top: 60px; 
        }
        .member-box { display: flex; flex-direction: column; align-items: center; }
        .member-photo { 
          width: 140px; 
          height: 140px; 
          border-radius: 40px; 
          object-fit: cover; 
          border: 4px solid #facc15; 
          margin-bottom: 20px; 
          background: white; 
          transition: 0.3s;
        }
        .member-box:hover .member-photo { transform: scale(1.05); }
        .member-role { 
          font-size: 0.75rem; 
          color: #facc15; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
        }
        .member-name { font-size: 1.2rem; font-weight: 800; margin-top: 8px; }

        @media (max-width: 850px) {
          .story-grid, .mv-grid { grid-template-columns: 1fr; }
          .about-title { font-size: 3rem; }
          .exec-container { border-radius: 30px; padding: 60px 20px; }
        }
      `}</style>

      <div className="about-page">
        <div className="container">
          
          <header className="hero-section">
            <div className="motto-badge">Faith • Excellence • Sportsmanship</div>
            <h1 className="about-title">
              Our Legacy, <br/>
              <span className="accent-blue">Your</span> <span className="accent-yellow">Platform.</span>
            </h1>
            <p className="slogan">Connecting generations.</p>
          </header>

          <div className="story-grid">
            <div className="story-text">
              <p>The St. Jerome League is a community-driven initiative established to revolutionize local football. We bridge the gap between raw talent and professional visibility by providing a high-stakes competitive environment.</p>
              <p style={{ marginTop: '20px' }}>Managed with transparency and integrity, we ensure that every kickoff contributes to the growth of Kampala's sporting culture and the development of future leaders.</p>
            </div>
            
            <div className="highlight-card">
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '25px' }}>
                <Trophy size={32} color="#1e40af" />
                <h3 style={{ fontWeight: 800, fontSize: '1.4rem' }}>League Standard</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, fontWeight: 700, color: '#475569' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={20} color="#1e40af"/> Certified Match Officials</li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={20} color="#1e40af"/> Verified Club Statistics</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={20} color="#1e40af"/> Community Safety First</li>
              </ul>
            </div>
          </div>

          <div className="mv-grid">
            <div className="mv-card">
              <div style={{ background: 'rgba(30, 64, 175, 0.1)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', marginBottom: '25px' }}>
                <Target size={30}/>
              </div>
              <h3>Our Mission</h3>
              <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.7 }}>To provide a professionalized sports environment that fosters discipline, promotes healthy competition, and builds community bonds across generations.</p>
            </div>
            
            <div className="mv-card">
              <div style={{ background: 'rgba(30, 64, 175, 0.1)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', marginBottom: '25px' }}>
                <Eye size={30}/>
              </div>
              <h3>Our Vision</h3>
              <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.7 }}>To become the gold standard for regional football leagues in Uganda, recognized for digital innovation, talent scouting, and athletic excellence.</p>
            </div>
          </div>

          {/* DYNAMIC CLUBS SECTION */}
          <div className="teams-section">
            <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: '2.2rem' }}>Participating <span className="accent-blue">Clubs</span></h2>
            <div className="teams-list">
              {loading ? <Loader2 className="animate-spin" color="#1e40af" size={40} /> : teams.map(team => (
                <div key={team.id} className="team-pill">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="team-logo" />
                  ) : (
                    <div className="team-logo" style={{ background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Shield size={32} color="#cbd5e1" />
                    </div>
                  )}
                  <span style={{fontSize: '0.85rem', textAlign: 'center'}}>{team.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC EXECUTIVE SECTION */}
          <div className="exec-container">
            <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: '2.5rem', margin: 0 }}>Executive <span style={{ color: '#facc15' }}>Committee.</span></h2>
            <p style={{ marginTop: '10px', opacity: 0.8 }}>The leadership driving excellence in the St. Jerome League.</p>
            
            <div className="exec-grid">
              {loading ? <Loader2 className="animate-spin" color="#facc15" size={40} /> : committee.map((member) => (
                <div key={member.id} className="member-box">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="member-photo" />
                  ) : (
                    <div className="member-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCircle size={80} color="#cbd5e1" />
                    </div>
                  )}
                  <div className="member-role">{member.position}</div>
                  <div className="member-name">{member.name}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default About;