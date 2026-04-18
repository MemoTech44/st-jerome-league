import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { 
  Clock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Calendar,
  Newspaper,
  ChevronRight
} from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

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

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      setSelectedArticle(null);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <Loader2 className="animate-spin" size={48} color="#1e40af" />
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b', fontFamily: 'Plus Jakarta Sans' }}>Fetching Latest Updates...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .news-page { background-color: #f1f5f9; padding: 140px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; }
        .container { max-width: 1100px; margin: 0 auto; }
        
        /* --- HEADER --- */
        .header-box { text-align: center; margin-bottom: 60px; }
        .header-box h1 { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(2.5rem, 7vw, 4rem); 
          letter-spacing: -2px; 
          color: #1e40af; 
          margin-bottom: 15px;
          font-weight: 800;
        }
        .header-description {
          max-width: 600px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #64748b;
          font-weight: 500;
        }

        /* --- FEATURED HERO --- */
        .featured-hero { 
          display: grid; 
          grid-template-columns: 1.1fr 0.9fr; 
          background: white; 
          border-radius: 40px; 
          overflow: hidden; 
          margin-bottom: 60px; 
          border: 1px solid #e2e8f0; 
          cursor: pointer; 
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.02); 
        }
        .featured-hero:hover { transform: translateY(-5px); border-color: #facc15; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .featured-img-box { height: 480px; background: #0f172a; }
        .featured-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .featured-text { padding: 50px; display: flex; flex-direction: column; justify-content: center; }

        /* --- NEWS GRID --- */
        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
        .standard-card { 
          background: white; 
          border-radius: 35px; 
          overflow: hidden; 
          border: 1px solid #e2e8f0; 
          transition: all 0.3s ease; 
          display: flex; 
          flex-direction: column; 
          cursor: pointer;
        }
        .standard-card:hover { transform: translateY(-8px); border-color: #1e40af; box-shadow: 0 15px 30px rgba(30, 64, 175, 0.08); }
        .card-img-box { height: 240px; overflow: hidden; }
        .card-img-box img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s ease; }
        .standard-card:hover .card-img-box img { transform: scale(1.08); }
        .card-body { padding: 35px; flex-grow: 1; }

        .tag-pill { 
          background: #f1f5f9; 
          color: #1e40af; 
          padding: 6px 14px; 
          border-radius: 12px; 
          font-size: 0.75rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          margin-bottom: 15px; 
          width: fit-content; 
        }

        /* --- MODAL (CENTERED ON ALL SCREENS) --- */
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px);
          z-index: 10000; display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: fadeIn 0.3s ease;
        }
        .modal-content {
          background: white; width: 100%; max-width: 650px; max-height: 90vh;
          border-radius: 45px; overflow-y: auto; position: relative;
          border-top: 12px solid #1e40af; box-shadow: 0 40px 80px rgba(0,0,0,0.5);
          animation: popScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin: auto; /* Ensures centering */
        }
        .modal-content::-webkit-scrollbar { display: none; }
        .modal-image { width: 100%; height: 350px; object-fit: cover; }
        .modal-body { padding: 45px; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popScale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 850px) {
          .featured-hero { grid-template-columns: 1fr; border-radius: 35px; }
          .featured-img-box { height: 280px; }
          .featured-text { padding: 35px; }
          .news-page { padding-top: 110px; }
          .modal-content { border-radius: 40px; width: 100%; }
          .modal-body { padding: 30px; }
        }
      `}</style>

      <div className="news-page">
        <div className="container">
          
          <header className="header-box">
            <h1>Latest League News</h1>
            <p className="header-description">
              Stay updated with the latest scores, transfer news, match highlights, and official announcements from the St. Jerome Alumni League.
            </p>
          </header>

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0' }}>
              <AlertCircle size={50} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontWeight: 800, color: '#64748b' }}>No news updates available at the moment.</h3>
            </div>
          ) : (
            <>
              {/* FEATURED STORY */}
              <div className="featured-hero" onClick={() => setSelectedArticle(featured)}>
                <div className="featured-img-box">
                  <img src={featured.image || featured.imageUrl} alt={featured.title} />
                </div>
                <div className="featured-text">
                  <div className="tag-pill" style={{ background: '#1e40af', color: 'white' }}>Trending Now</div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 15px 0', lineHeight: 1.15 }}>{featured.title}</h2>
                  <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '30px', fontWeight: 500 }}>
                    {featured.excerpt || featured.content?.substring(0, 160) + "..."}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#1e40af', fontWeight: 800 }}>
                    <Calendar size={18} color="#facc15" /> {featured.date}
                  </div>
                </div>
              </div>

              {/* GRID STORIES */}
              <div className="news-grid">
                {regular.map((article) => (
                  <div key={article.id} className="standard-card" onClick={() => setSelectedArticle(article)}>
                    <div className="card-img-box">
                      <img src={article.image || article.imageUrl} alt={article.title} />
                    </div>
                    <div className="card-body">
                      <div className="tag-pill">{article.category || "League Update"}</div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', lineHeight: 1.4 }}>{article.title}</h3>
                      <div style={{ color: '#1e40af', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Read Story <ChevronRight size={18} color="#facc15" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* CENTERED MODAL */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <img src={selectedArticle.image || selectedArticle.imageUrl} className="modal-image" alt={selectedArticle.title} />
            
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center' }}>
                <span className="tag-pill" style={{ margin: 0, background: '#eff6ff' }}>{selectedArticle.category || "Article"}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} /> {selectedArticle.date}
                </span>
              </div>

              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e40af', lineHeight: 1.1, marginBottom: '25px', letterSpacing: '-1px' }}>
                {selectedArticle.title}
              </h2>

              <div style={{ color: '#334155', fontSize: '1.15rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontWeight: 500, marginBottom: '40px' }}>
                {selectedArticle.content}
              </div>

              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ 
                  background: '#1e40af', 
                  color: 'white', 
                  border: 'none', 
                  padding: '20px', 
                  borderRadius: '20px', 
                  fontWeight: 800, 
                  fontSize: '1rem',
                  cursor: 'pointer', 
                  width: '100%', 
                  boxShadow: '0 10px 20px rgba(30, 64, 175, 0.2)',
                  transition: '0.3s'
                }}
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;