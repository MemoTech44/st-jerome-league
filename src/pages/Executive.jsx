import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { UserCircle, Loader2 } from 'lucide-react';

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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .exec-page { 
          background-color: #f8fafc; 
          min-height: 100vh; 
          padding: 140px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #1e293b; 
        }
        .container { max-width: 1100px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 60px; }
        .header-box h1 { 
          font-size: clamp(2.2rem, 5vw, 3.2rem); 
          letter-spacing: -1px; 
          color: #1e3a8a; 
          margin: 0;
          font-weight: 800;
        }
        .header-underline {
          width: 60px;
          height: 5px;
          background: #facc15; 
          margin: 15px auto 25px;
          border-radius: 10px;
        }
        .header-description {
          max-width: 750px;
          margin: 0 auto;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #64748b;
          font-weight: 600;
        }

        .exec-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 30px; 
        }
        
        .member-card { 
          background: #ffffff; 
          border-radius: 24px; 
          padding: 45px 25px; 
          text-align: center; 
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        
        .member-card:hover { 
          transform: translateY(-10px); 
          border-color: #1e3a8a; 
          box-shadow: 0 20px 40px -15px rgba(30,58,138,0.1);
        }

        .photo-container {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto 25px;
        }

        .member-photo { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          border-radius: 50%; 
          border: 4px solid #1e3a8a; 
          background: #f8fafc;
          padding: 3px;
        }

        .member-name { 
          font-size: 1.35rem; 
          font-weight: 800; 
          margin-bottom: 10px; 
          color: #0f172a;
          text-transform: capitalize;
        }

        .member-role { 
          color: #1e3a8a; 
          font-size: 0.8rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 0.8px;
          background: #eff6ff; 
          padding: 6px 18px;
          border-radius: 50px;
          display: inline-block;
          border: 1px solid #dbeafe;
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
            <h1>League Executive Committee</h1>
            <div className="header-underline"></div>
            <p className="header-description">
              Meet the visionary team driving the St. Jerome Alumni League forward. 
              Our executive board is committed to fostering sportsmanship, strengthening 
              alumni bonds, and ensuring excellence across all league operations.
            </p>
          </header>

          <div className="exec-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                <Loader2 className="animate-spin" color="#1e3a8a" size={40} style={{ margin: '0 auto' }} />
              </div>
            ) : committee.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8' }}>
                <p>No committee members found.</p>
              </div>
            ) : (
              committee.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="photo-container">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="member-photo" />
                    ) : (
                      <div className="member-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCircle size={90} color="#cbd5e1" />
                      </div>
                    )}
                  </div>
                  
                  <div className="member-name">{member.name.toLowerCase()}</div>
                  <div className="member-role">{member.position}</div>
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