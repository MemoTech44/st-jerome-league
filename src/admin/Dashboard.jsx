import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  Trophy, 
  Users, 
  UserCircle,
  MessageSquare, 
  LogOut, 
  ShieldAlert,
  Calendar,
  ClipboardCheck
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

// Import sub-components
import NewsManager from './NewsManager';
import FixturesManager from './FixturesManager'; // For Scheduling
import ResultsManager from './ResultsManager';   // For Post-match scores/scorers
import TeamManager from './TeamManager';
import ExecutiveManager from './ExecutiveManager';
import ContactMessages from './ContactMessages';
import PlayerManager from './PlayerManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ clubs: 0, news: 0, messages: 0, players: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/login'));
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const [clubs, news, msgs, players] = await Promise.all([
          getDocs(collection(db, "clubs")),
          getDocs(collection(db, "news")),
          getDocs(collection(db, "messages")),
          getDocs(collection(db, "players"))
        ]);
        
        setStats({
          clubs: clubs.size,
          news: news.size,
          messages: msgs.size,
          players: players.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (activeTab === 'overview') fetchStats();
  }, [activeTab]);

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        border: 'none',
        background: activeTab === id ? '#1e40af' : 'transparent',
        color: activeTab === id ? '#ffffff' : '#64748b',
        cursor: 'pointer',
        fontFamily: 'Archivo',
        textTransform: 'uppercase',
        fontSize: '0.8rem',
        fontWeight: '800',
        transition: '0.2s',
        textAlign: 'left'
      }}
    >
      <Icon size={18} color={activeTab === id ? '#ffffff' : '#64748b'} />
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ color: '#0f172a' }}>
            <div className="stat-grid">
              <div className="mini-stat">
                <h5>Clubs</h5>
                <p>{loadingStats ? '...' : stats.clubs.toString().padStart(2, '0')}</p>
              </div>
              <div className="mini-stat">
                <h5>Players</h5>
                <p>{loadingStats ? '...' : stats.players.toString().padStart(2, '0')}</p>
              </div>
              <div className="mini-stat">
                <h5>News</h5>
                <p>{loadingStats ? '...' : stats.news.toString().padStart(2, '0')}</p>
              </div>
              <div className="mini-stat" style={{borderLeftColor: '#facc15'}}>
                <h5>Messages</h5>
                <p>{loadingStats ? '...' : stats.messages.toString().padStart(2, '0')}</p>
              </div>
            </div>

            <div className="content-card">
              <h3 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 15px 0' }}>Admin Instructions</h3>
              <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Welcome to the STJ HQ portal. To manage the league, use **Fixtures** to schedule upcoming games. 
                Once a game is played, navigate to **Results** to record final scores and individual goal scorers. 
                All updates sync to the live table immediately.
              </p>
              <div style={{ marginTop: '25px', padding: '15px', background: '#eff6ff', borderRadius: '12px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid #bfdbfe' }}>
                <ShieldAlert size={20} color="#1e40af" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af' }}>Database Connection: Active</span>
              </div>
            </div>
          </div>
        );
      case 'news': return <NewsManager />;
      case 'fixtures': return <FixturesManager />;
      case 'results': return <ResultsManager />;
      case 'clubs': return <TeamManager />;
      case 'players': return <PlayerManager />;
      case 'exec': return <ExecutiveManager />;
      case 'inbox': return <ContactMessages />;
      default: return <div>Module not found.</div>;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Inter:wght@400;600;700&display=swap');
        .admin-layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; background: #f1f5f9; font-family: 'Inter', sans-serif; }
        .sidebar { background: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; z-index: 10; }
        .sidebar-header { padding: 30px 25px; border-bottom: 1px solid #f1f5f9; }
        .sidebar-header h1 { font-family: 'Archivo', sans-serif; font-size: 1.2rem; color: #1e40af; margin: 0; text-transform: uppercase; }
        .main-content { padding: 40px 50px; background: #f8fafc; overflow-y: auto; }
        .content-card { background: white; border-radius: 16px; padding: 35px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .mini-stat { background: #ffffff; padding: 20px; border-radius: 14px; border-left: 5px solid #1e40af; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .mini-stat h5 { margin: 0; color: #94a3b8; font-size: 0.7rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
        .mini-stat p { margin: 8px 0 0; font-family: 'Archivo'; font-size: 1.8rem; color: #0f172a; }
        @media (max-width: 1024px) {
          .admin-layout { grid-template-columns: 70px 1fr; }
          .sidebar-header, .nav-label { display: none; }
        }
      `}</style>

      <div className="admin-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>STJ HQ</h1>
            <p style={{fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', fontWeight: 800, textTransform: 'uppercase'}}>League Management</p>
          </div>

          <nav style={{ flex: 1, paddingTop: '15px' }}>
            <SidebarItem id="overview" icon={LayoutDashboard} label={<span className="nav-label">Overview</span>} />
            <div style={{ padding: '20px 20px 10px', fontSize: '0.6rem', fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase' }} className="nav-label">Content</div>
            <SidebarItem id="news" icon={Newspaper} label={<span className="nav-label">News</span>} />
            <SidebarItem id="inbox" icon={MessageSquare} label={<span className="nav-label">Messages</span>} />
            
            <div style={{ padding: '20px 20px 10px', fontSize: '0.6rem', fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase' }} className="nav-label">Competition</div>
            <SidebarItem id="fixtures" icon={Calendar} label={<span className="nav-label">Fixtures</span>} />
            <SidebarItem id="results" icon={ClipboardCheck} label={<span className="nav-label">Record Results</span>} />
            
            <div style={{ padding: '20px 20px 10px', fontSize: '0.6rem', fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase' }} className="nav-label">People & Teams</div>
            <SidebarItem id="clubs" icon={Trophy} label={<span className="nav-label">Clubs</span>} />
            <SidebarItem id="players" icon={UserCircle} label={<span className="nav-label">Players</span>} />
            <SidebarItem id="exec" icon={Users} label={<span className="nav-label">Executives</span>} />
          </nav>

          <button onClick={handleLogout} style={{ margin: '20px', padding: '12px', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#991b1b', fontFamily: 'Archivo', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <LogOut size={16} /> <span className="nav-label">LOGOUT</span>
          </button>
        </aside>

        <main className="main-content">
          <header style={{ marginBottom: '35px' }}>
            <h2 style={{ fontFamily: 'Archivo', fontSize: '2rem', textTransform: 'uppercase', margin: 0, color: '#0f172a', letterSpacing: '-1px' }}>
              {activeTab.replace('-', ' ')}
            </h2>
            <div style={{ height: '4px', width: '40px', background: '#facc15', marginTop: '8px' }}></div>
          </header>

          <section className="dashboard-body">
            {renderContent()}
          </section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;