import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CharacterPage from './pages/CharacterPage';
import SeasonPage from './pages/SeasonPage';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/character/:id" element={<CharacterPage />} />
        <Route path="/season/:seasonName" element={<SeasonPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </Router>
  );
}

export default App;
