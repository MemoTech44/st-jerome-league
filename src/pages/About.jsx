import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Target, Eye, Loader2, Shield, 
  History, UserCheck, Flag, Briefcase, ChevronRight
} from 'lucide-react';

import heroImg from '../assets/top.jpeg';
import secondaryImg from '../assets/fall.jpeg';

const About = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsSnapshot = await getDocs(collection(db, "clubs"));
        const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedTeams = teamsData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .about-page { 
          background: #04060d; 
          min-height: 100vh; 
          padding: 120px 5% 80px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc;
          box-sizing: border-box;
        }

        .container { 
          max-width: 1100px; 
          margin: 0 auto; 
        }
        
        /* Typography Highlights */
        .gold-text { color: #facc15; }

        /* Header Section */
        .section-header { 
          text-align: center; 
          margin-bottom: 40px; 
        }

        .header-tag {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .section-header h1 { 
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3rem, 7vw, 4.8rem); 
          color: #ffffff; 
          letter-spacing: 2px; 
          margin: 0; 
          line-height: 1;
        }

        .header-underline { 
          width: 80px; 
          height: 4px; 
          background: linear-gradient(90deg, #facc15, rgba(250, 204, 21, 0.2)); 
          margin: 20px auto 25px; 
          border-radius: 4px; 
        }

        .header-description {
          max-width: 720px;
          margin: 0 auto;
          color: #94a3b8;
          font-size: 1rem;
          line-height: 1.7;
          font-weight: 500;
        }

        /* Image Banners */
        .page-banner {
          width: 100%;
          height: 380px;
          border-radius: 28px;
          overflow: hidden;
          margin-bottom: 70px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .page-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          display: block;
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(4, 6, 13, 0.2) 0%, rgba(4, 6, 13, 0.7) 100%);
        }

        /* History Box */
        .history-box {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 30px; 
          padding: 45px;
          margin-bottom: 70px; 
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: grid; 
          grid-template-columns: 1fr 1.2fr; 
          gap: 40px; 
          align-items: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .history-title-group {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 16px;
        }

        .history-title-group h2 {
          font-family: 'Bebas Neue', cursive;
          font-size: 2.8rem;
          letter-spacing: 1px;
          color: #ffffff;
          margin: 0;
        }

        .history-timeline {
          border-left: 2px solid rgba(250, 204, 21, 0.4);
          padding-left: 25px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .timeline-item-date {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          color: #facc15;
          font-size: 0.95rem;
          display: block;
          margin-bottom: 4px;
        }

        .timeline-item-desc {
          margin: 0;
          color: #cbd5e1;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Feature Cards (Mission & Vision) */
        .feature-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 25px; 
          margin-bottom: 70px; 
        }

        .feature-card { 
          background: rgba(15, 23, 42, 0.6); 
          padding: 35px; 
          border-radius: 24px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          text-align: center; 
          transition: all 0.3s ease; 
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .feature-card:hover { 
          transform: translateY(-5px); 
          border-color: rgba(250, 204, 21, 0.5); 
          box-shadow: 0 15px 35px rgba(250, 204, 21, 0.1);
        }

        .feature-icon-wrapper {
          background: rgba(30, 64, 175, 0.25);
          width: 65px;
          height: 65px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid rgba(30, 64, 175, 0.4);
        }

        .feature-card h3 {
          font-family: 'Bebas Neue', cursive;
          font-size: 2rem;
          letter-spacing: 1px;
          color: #ffffff;
          margin: 0 0 12px 0;
        }

        .feature-card p {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        /* Section Headings */
        .section-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 2.8rem;
          letter-spacing: 1.5px;
          color: #ffffff;
          margin: 0;
          text-align: center;
        }

        .section-subtitle {
          color: #94a3b8;
          font-size: 0.9rem;
          text-align: center;
          margin-top: 4px;
          margin-bottom: 40px;
        }

        /* Teams Grid */
        .teams-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
          gap: 20px; 
        }

        .team-card { 
          background: rgba(15, 23, 42, 0.6); 
          padding: 30px 20px; 
          border-radius: 20px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          text-align: center; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .team-card:hover { 
          transform: translateY(-6px); 
          border-color: #facc15; 
          box-shadow: 0 12px 25px rgba(250, 204, 21, 0.15); 
          background: rgba(15, 23, 42, 0.85);
        }

        .team-logo-container { 
          height: 80px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 15px; 
          width: 100%;
        }

        .team-logo-container img {
          max-width: 75px; 
          max-height: 75px; 
          object-fit: contain; 
          object-position: center 25%;
        }

        .team-name {
          font-weight: 700;
          font-size: 1rem;
          color: #f8fafc;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .team-arrow {
          color: #facc15;
          opacity: 0.6;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .team-card:hover .team-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* Modal Details */
        .modal-overlay { 
          position: fixed; 
          inset: 0; 
          background: rgba(4, 6, 13, 0.85); 
          backdrop-filter: blur(8px); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 10000; 
          padding: 20px; 
        }

        .modal-content { 
          background: #0f172a; 
          color: #f8fafc;
          width: 90%; 
          max-width: 440px; 
          max-height: 85vh; 
          overflow-y: auto;
          border-radius: 24px; 
          padding: 30px 25px; 
          border: 1px solid rgba(250, 204, 21, 0.3);
          animation: modalPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
          margin: auto;
        }

        @keyframes modalPop {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-content::-webkit-scrollbar { display: none; }

        .modal-header-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 2.2rem;
          letter-spacing: 1px;
          color: #ffffff;
          margin: 0;
          line-height: 1;
          text-transform: uppercase;
        }

        .roles-list { 
          display: flex;
          flex-direction: column;
          gap: 10px; 
          margin: 20px 0; 
        }

        .role-badge {
          background: rgba(255, 255, 255, 0.03); 
          padding: 12px 16px; 
          border-radius: 14px; 
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex; 
          align-items: center; 
          gap: 12px;
        }

        .role-info span { 
          display: block; 
          font-weight: 700; 
          color: #f8fafc; 
          font-size: 0.85rem; 
          text-transform: uppercase;
        }

        .role-info small { 
          display: block; 
          color: #facc15; 
          font-weight: 700; 
          font-size: 0.65rem; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
        }

        .modal-bio-box {
          background: rgba(4, 6, 13, 0.4); 
          padding: 16px; 
          border-radius: 14px; 
          border: 1px solid rgba(255, 255, 255, 0.06); 
          margin-bottom: 20px; 
        }

        .modal-bio-box p {
          color: #94a3b8; 
          line-height: 1.6; 
          font-weight: 500; 
          font-size: 0.85rem; 
          margin: 0;
          text-transform: uppercase;
        }

        .modal-action-btn {
          width: 100%; 
          padding: 14px; 
          background: #facc15; 
          color: #04060d; 
          border: none; 
          border-radius: 14px; 
          font-family: 'Bebas Neue', cursive;
          font-size: 1.2rem; 
          letter-spacing: 1px;
          cursor: pointer; 
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .modal-action-btn:hover {
          background: #ffe066;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) { 
          .page-banner { height: 240px; margin-bottom: 45px; }
          .history-box { 
            grid-template-columns: 1fr; 
            text-align: center; 
            padding: 30px 20px; 
          }
          .history-title-group { justify-content: center; }
          .history-timeline { border-left: none; padding-left: 0; }
        }
      `}</style>

      <div className="container">
        {/* HEADER */}
        <header className="section-header">
          <span className="header-tag">The Spirit of Ndama</span>
          <h1>ABOUT <span className="gold-text">US</span></h1>
          <div className="header-underline"></div>
          <p className="header-description">
            Operating under the mother body of the <strong>Jerome Students Association (JOSA)</strong>, 
            the St. Jerome Alumni League unites former students through athletic excellence, lifelong fellowship, and shared heritage.
          </p>
        </header>

        {/* IMAGE 1: START OF PAGE BANNER */}
        <div className="page-banner">
          <img 
            src={secondaryImg} 
            alt="St. Jerome League Match Action" 
          />
          <div className="banner-overlay"></div>
        </div>

        {/* HISTORY */}
        <div className="history-box">
          <div>
            <div className="history-title-group">
              <History size={36} className="gold-text" />
              <h2>Our Journey</h2>
            </div>
            <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              What started as a casual reunion on the pitch has evolved into a fully structured, 
              professional alumni league that preserves the brotherhood formed at St. Jerome.
            </p>
          </div>
          <div className="history-timeline">
            <div>
              <span className="timeline-item-date">March 2024</span>
              <p className="timeline-item-desc">Inaugural Gala event held at Supremacy Lounge, establishing our official foundation.</p>
            </div>
            <div>
              <span className="timeline-item-date">August 2025</span>
              <p className="timeline-item-desc">Official kickoff of Season One at Prime Arena, bringing structured competition to our alumni.</p>
            </div>
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Target size={30} className="gold-text" />
            </div>
            <h3>Our Mission</h3>
            <p>To foster unity, networking, and wellness among alumni through professional sporting excellence and mutual support.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Eye size={30} className="gold-text" />
            </div>
            <h3>Our Vision</h3>
            <p>To become the most innovative alumni sports community in Uganda, connecting generations of talent digitally.</p>
          </div>
        </div>

        {/* IMAGE 2: MIDDLE BANNER BEFORE CLUBS */}
        <div className="page-banner">
          <img 
            src={heroImg} 
            alt="St. Jerome Community & Teams" 
          />
          <div className="banner-overlay"></div>
        </div>

        {/* CLUBS SECTION */}
        <div>
          <h2 className="section-title">Member <span className="gold-text">Clubs</span></h2>
          <p className="section-subtitle">The pillars of our league championship</p>
        </div>

        <div className="teams-grid">
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
              <Loader2 className="animate-spin gold-text" size={40} />
            </div>
          ) : teams.map(team => (
            <div key={team.id} className="team-card" onClick={() => setSelectedTeam(team)}>
              <div className="team-logo-container">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} />
                ) : (
                  <Shield size={60} color="#334155" />
                )}
              </div>
              <div className="team-name">{team.name ? team.name.toUpperCase() : ''}</div>
              <ChevronRight size={18} className="team-arrow" />
            </div>
          ))}
        </div>

        {/* COMPACT CENTERED MODAL */}
        {selectedTeam && (
          <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  {selectedTeam.logoUrl ? (
                    <img src={selectedTeam.logoUrl} alt={selectedTeam.name} style={{ maxHeight: '75px', objectFit: 'contain', objectPosition: 'center 25%' }} />
                  ) : (
                    <Shield size={65} color="#334155" />
                  )}
                </div>
                <h2 className="modal-header-title">{selectedTeam.name ? selectedTeam.name.toUpperCase() : ''}</h2>
              </div>

              <div className="roles-list">
                <div className="role-badge">
                  <UserCheck size={18} className="gold-text" />
                  <div className="role-info">
                    <small>Chairman</small>
                    <span>{selectedTeam.chairman ? selectedTeam.chairman.toUpperCase() : 'NOT SET'}</span>
                  </div>
                </div>
                <div className="role-badge">
                  <Briefcase size={18} className="gold-text" />
                  <div className="role-info">
                    <small>Head Coach</small>
                    <span>{selectedTeam.coach ? selectedTeam.coach.toUpperCase() : 'NOT SET'}</span>
                  </div>
                </div>
                <div className="role-badge">
                  <Flag size={18} className="gold-text" />
                  <div className="role-info">
                    <small>Captain</small>
                    <span>{selectedTeam.captain ? selectedTeam.captain.toUpperCase() : 'NOT SET'}</span>
                  </div>
                </div>
              </div>

              <div className="modal-bio-box">
                <p>
                  {selectedTeam.description 
                    ? selectedTeam.description.toUpperCase() 
                    : `${selectedTeam.name ? selectedTeam.name.toUpperCase() : ''} IS A VITAL CLUB WITHIN THE ST. JEROME COMMUNITY, EMBODYING SPORTSMANSHIP AND ALUMNI UNITY.`}
                </p>
              </div>

              <button className="modal-action-btn" onClick={() => setSelectedTeam(null)}>
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