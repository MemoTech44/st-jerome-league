import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

const GalleryView = () => {
  const [matchdays, setMatchdays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const q = query(collection(db, "matchdayGalleries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setMatchdays(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  return (
    <div style={{ backgroundColor: '#060913', minHeight: '100vh', width: '100%' }}>
      <div style={{ padding: '120px 15px 30px 15px', maxWidth: '1000px', margin: '0 auto', color: '#fff', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', color: '#facc15', marginBottom: '8px' }}>
          ST. JEROME LEAGUE GALLERY
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#facc15', margin: '0 0 10px 0', letterSpacing: '1px' }}>
          MATCHDAY PHOTO
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '40px' }}>
          Catch the highlights here, then click through to download your photos and action shots!
        </p>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading photo galleries...</p>
        ) : matchdays.length === 0 ? (
          <div style={{ padding: '50px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <ImageIcon size={48} color="#94a3b8" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#94a3b8' }}>No matchday galleries uploaded yet. Check back soon after matchday!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {matchdays.map(matchday => (
              <div 
                key={matchday.id} 
                style={{ 
                  background: 'rgba(15, 23, 42, 0.75)', 
                  backdropFilter: 'blur(12px)', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  padding: '25px',
                  textAlign: 'left',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#facc15', fontWeight: 'bold' }}>
                    {matchday.title}
                  </h3>
                  <a 
                    href={matchday.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      background: '#facc15', 
                      color: '#04060d', 
                      padding: '10px 18px', 
                      borderRadius: '12px', 
                      fontWeight: '900', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      textDecoration: 'none', 
                      fontSize: '0.8rem',
                      boxShadow: '0 4px 15px rgba(250, 204, 21, 0.25)'
                    }}
                  >
                    <ExternalLink size={16} /> VIEW ALL PHOTOS ON GOOGLE DRIVE
                  </a>
                </div>

                {/* 4 Preview Thumbnail Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {matchday.previewImages && matchday.previewImages.map((imgUrl, idx) => (
                    <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b1329' }}>
                      <img 
                        src={imgUrl} 
                        alt={`Preview ${idx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;