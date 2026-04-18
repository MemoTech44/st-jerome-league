import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { UserCircle, Loader2 } from 'lucide-react';

const Executive = () => {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const q = query(collection(db, "members"), orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        setCommittee(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .exec-page { 
          background-color: #f1f5f9; 
          min-height: 100vh; 
          padding: 140px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #1e293b; 
        }
        .container { max-width: 1100px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 60px; }
        .header-box h1 { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(2.2rem, 5vw, 3.8rem); 
          letter-spacing: -1.5px; 
          color: #1e40af; 
          margin: 0;
          font-weight: 800;
          /* Removed text-transform: uppercase to allow standard capitalization */
        }
        .header-underline {
          width: 80px;
          height: 6px;
          background: #facc15; 
          margin: 15px auto 25px;
          border-radius: 10px;
        }
        .header-description {
          max-width: 700px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #475569;
          font-weight: 500;
        }

        .exec-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
          gap: 30px; 
        }
        
        .member-card { 
          background: #ffffff; 
          border-radius: 30px; 
          padding: 40px 20px; 
          text-align: center; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          transition: transform 0.3s ease;
        }
        
        .member-card:hover { 
          transform: translateY(-8px); 
          border-color: #facc15; 
        }

        .photo-container {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto 25px;
        }

        .member-photo { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          border-radius: 50%; 
          border: 5px solid #1e40af; 
          background: #f8fafc;
        }

        .member-name { 
          font-size: 1.5rem; 
          font-weight: 800; 
          margin-bottom: 8px; 
          color: #0f172a;
        }

        .member-role { 
          color: #1e40af; 
          font-size: 0.85rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 1px;
          background: rgba(250, 204, 21, 0.2); 
          padding: 5px 15px;
          border-radius: 50px;
          display: inline-block;
        }

        @media (max-width: 600px) {
          .exec-page { padding-top: 100px; }
          .exec-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="exec-page">
        <div className="container">
          <header className="header-box">
            <h1>League Executive Committee</h1>
            <div className="header-underline"></div>
            <p className="header-description">
              The dedicated team of leaders responsible for overseeing the strategic direction, 
              governance, and day-to-day operations of the St. Jerome Alumni League. 
              Our committee ensures the highest standards of integrity and fair play.
            </p>
          </header>

          <div className="exec-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                <Loader2 className="animate-spin" color="#1e40af" size={40} />
              </div>
            ) : (
              committee.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="photo-container">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="member-photo" />
                    ) : (
                      <div className="member-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCircle size={100} color="#cbd5e1" />
                      </div>
                    )}
                  </div>
                  
                  <div className="member-name">{member.name}</div>
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