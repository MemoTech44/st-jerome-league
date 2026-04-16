import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { 
  Clock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Shield,
  X,
  Calendar,
  Tag
} from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null); // State for the pop-out

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsQuery = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(newsQuery);
        const newsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }) || "Recently Posted"
        }));
        setArticles(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featured = articles[0];
  const regular = articles.slice(1);

  // Close modal when clicking outside content
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      setSelectedArticle(null);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <Loader2 className="animate-spin" size={48} color="#1e40af" />
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b' }}>Loading League News...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .news-page { background-color: #f1f5f9; padding: 140px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header-center { text-align: center; margin-bottom: 60px; }
        .news-title { font-family: 'Inter', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; letter-spacing: -2px; color: #0f172a; }

        /* --- HERO & GRID CARDS --- */
        .featured-hero { display: grid; grid-template-columns: 1.2fr 0.8fr; background: white; border-radius: 40px; overflow: hidden; margin-bottom: 60px; border: 1px solid #e2e8f0; cursor: pointer; }
        .featured-img-box { height: 500px; background: #0f172a; overflow: hidden; }
        .featured-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .featured-text { padding: 60px; display: flex; flex-direction: column; justify-content: center; }

        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 30px; }
        .standard-card { background: white; border-radius: 30px; overflow: hidden; border: 1px solid #e2e8f0; transition: 0.3s; display: flex; flex-direction: column; cursor: pointer; }
        .standard-card:hover { transform: translateY(-10px); border-color: #1e40af; }
        .card-img-box { height: 240px; overflow: hidden; }
        .card-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .card-body { padding: 35px; flex-grow: 1; }

        .tag-pill { background: rgba(30, 64, 175, 0.1); color: #1e40af; padding: 6px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; width: fit-content; }

        /* --- MODAL STYLES --- */
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          width: 100%; max-width: 800px;
          max-height: 90vh;
          border-radius: 40px;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close {
          position: sticky; top: 20px; left: 92%;
          background: white; border: none; width: 45px; height: 45px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 10; border: 1px solid #e2e8f0;
        }

        .modal-image { width: 100%; height: 400px; object-fit: cover; }
        .modal-body { padding: 40px; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 968px) {
          .featured-hero { grid-template-columns: 1fr; }
          .featured-img-box { height: 300px; }
          .modal-content { border-radius: 25px; }
          .modal-image { height: 250px; }
        }
      `}</style>

      <div className="news-page">
        <div className="container">
          <div className="header-center">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1e40af', marginBottom: '10px' }}>
              <Shield size={18} />
              <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Official Updates</span>
            </div>
            <h1 className="news-title">League <span style={{color: '#1e40af'}}>Pulse.</span></h1>
          </div>

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0' }}>
              <AlertCircle size={60} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontWeight: 800 }}>No stories published yet.</h3>
            </div>
          ) : (
            <>
              {/* FEATURED STORY */}
              <div className="featured-hero" onClick={() => setSelectedArticle(featured)}>
                <div className="featured-img-box">
                  <img src={featured.image || featured.imageUrl} alt={featured.title} />
                </div>
                <div className="featured-text">
                  <div className="tag-pill">{featured.category || "Featured Story"}</div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1, margin: '10px 0 20px' }}>{featured.title}</h2>
                  <p style={{ color: '#64748b', marginBottom: '30px' }}>{featured.excerpt || featured.content?.substring(0, 160) + "..."}</p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> {featured.date}</span>
                  </div>
                </div>
              </div>

              {/* REGULAR NEWS GRID */}
              <div className="news-grid">
                {regular.map((article) => (
                  <div key={article.id} className="standard-card" onClick={() => setSelectedArticle(article)}>
                    <div className="card-img-box">
                      <img src={article.image || article.imageUrl} alt={article.title} />
                    </div>
                    <div className="card-body">
                      <div className="tag-pill">{article.category || "Match Update"}</div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '15px' }}>{article.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
                        {article.excerpt || article.content?.substring(0, 100) + "..."}
                      </p>
                      <div style={{ color: '#1e40af', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Read More <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* POP-OUT MODAL */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSelectedArticle(null)}>
              <X size={24} color="#0f172a" />
            </button>
            
            <img 
              src={selectedArticle.image || selectedArticle.imageUrl} 
              className="modal-image" 
              alt={selectedArticle.title} 
            />
            
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#1e40af', background: '#eff6ff', padding: '6px 12px', borderRadius: '8px' }}>
                  <Tag size={14} /> {selectedArticle.category || "General News"}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', padding: '6px 12px' }}>
                  <Calendar size={14} /> {selectedArticle.date}
                </span>
              </div>

              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginBottom: '25px' }}>
                {selectedArticle.title}
              </h2>

              <div style={{ 
                color: '#334155', 
                fontSize: '1.1rem', 
                lineHeight: 1.8, 
                whiteSpace: 'pre-wrap' // Keeps paragraph spacing from Firebase
              }}>
                {selectedArticle.content}
              </div>
            </div>
            
            <div style={{ padding: '40px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ background: '#1e40af', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontWeight: 800, cursor: 'pointer' }}
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;