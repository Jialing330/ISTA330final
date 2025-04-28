import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h1 className="nav-title" onClick={() => navigate('/home')}>
        Community Center
      </h1>

      <div className="nav-right">
        <button className="nav-link" onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </button>
        {currentUser && (
          <span className="nav-user">{currentUser.email}</span>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
