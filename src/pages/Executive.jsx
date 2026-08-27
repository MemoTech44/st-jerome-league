import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { UserCircle, Loader2, Award } from 'lucide-react';

const Executive = () => {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const q = query(collection(db, "members"));
        const snapshot = await getDocs(q);
        const memberData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort by rank: 1 at the top, missing ranks at the bottom (99)
        const sortedData = memberData.sort((a, b) => {
          const rankA = a.rank !== undefined ? Number(a.rank) : 99;
          const rankB = b.rank !== undefined ? Number(b.rank) : 99;
          return rankA - rankB;
        });

        setCommittee(sortedData);
      } catch (error) {
        console.error("Error fetching committee:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommittee();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .exec-page { 
          background-color: #04060d; 
          min-height: 100vh; 
          padding: 120px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc; 
          box-sizing: border-box;
        }

        .container { 
          max-width: 1100px; 
          margin: 0 auto; 
        }
        
        .gold-text { color: #facc15; }

        /* Header Section */
        .header-box { 
          text-align: center; 
          margin-bottom: 60px; 
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

        .header-box h1 { 
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

        /* Executive Grid */
        .exec-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 30px; 
        }
        
        /* Member Card Styling */
        .member-card { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          border-radius: 28px; 
          padding: 40px 25px; 
          text-align: center; 
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        
        .member-card:hover { 
          transform: translateY(-8px); 
          border-color: rgba(250, 204, 21, 0.5); 
          box-shadow: 0 20px 40px rgba(250, 204, 21, 0.12);
          background: rgba(15, 23, 42, 0.85);
        }

        /* Photo Holder */
        .photo-container {
          position: relative;
          width: 130px;
          height: 130px;
          margin: 0 auto 20px;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, #facc15, rgba(250, 204, 21, 0.1));
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .member-photo { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          border-radius: 50%; 
          background: #0f172a;
          display: block;
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Member Info */
        .member-name { 
          font-size: 1.3rem; 
          font-weight: 700; 
          margin-bottom: 12px; 
          color: #ffffff;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }

        .member-role { 
          color: #facc15; 
          font-size: 0.75rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 1px;
          background: rgba(250, 204, 21, 0.1); 
          padding: 8px 18px;
          border-radius: 50px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(250, 204, 21, 0.25);
        }

        @media (max-width: 600px) {
          .exec-page { padding-top: 100px; }
          .exec-grid { grid-template-columns: 1fr; gap: 20px; }
          .member-card { padding: 35px 20px; }
        }
      `}</style>

      <div className="exec-page">
        <div className="container">
          <header className="header-box">
            <span className="header-tag">Leadership & Governance</span>
            <h1>EXECUTIVE <span className="gold-text">COMMITTEE</span></h1>
            <div className="header-underline"></div>
            <p className="header-description">
              Meet the visionary team driving the St. Jerome Alumni League forward. 
              Our executive board is committed to fostering sportsmanship, strengthening 
              alumni bonds, and ensuring operational excellence.
            </p>
          </header>

          <div className="exec-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                <Loader2 className="animate-spin gold-text" size={42} style={{ margin: '0 auto' }} />
              </div>
            ) : committee.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '60px 0' }}>
                <p>No committee members found.</p>
              </div>
            ) : (
              committee.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="photo-container">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="member-photo" />
                    ) : (
                      <div className="photo-placeholder">
                        <UserCircle size={80} color="#475569" />
                      </div>
                    )}
                  </div>
                  
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">
                    <Award size={14} />
                    {member.position || 'Board Member'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Executive;