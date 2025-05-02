import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import Navbar from '../components/Navbar';

export default function Settings() {
  const [bundleType, setBundleType] = useState('Standard');
  const [characters, setCharacters] = useState([]);
  const [newCharacter, setNewCharacter] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) return;
    const savedBundle = localStorage.getItem('bundleType');
    if (savedBundle) setBundleType(savedBundle);
    fetchCharacters();
  }, [currentUser]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch(`http://localhost:8888/api/characters/${currentUser.id}`);
      const data = await res.json();
      setCharacters(data.characters || []);
    } catch (err) {
      console.error('Failed to load characters:', err);
      setCharacters([]);
    }
  };

  const toggleBundleType = () => {
    const next = bundleType === 'Standard' ? 'Remixed' : 'Standard';
    setBundleType(next);
    localStorage.setItem('bundleType', next);
  };

  const handleAddCharacter = async () => {
    if (!newCharacter.trim()) return setError('Character name cannot be empty.');
    if (characters.some(c => c.name === newCharacter.trim())) return setError('Character already exists.');
    try {
      await fetch('http://localhost:8888/api/characters/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, name: newCharacter.trim() }),
      });
      await fetchCharacters();
      setNewCharacter('');
      setError('');
    } catch (err) {
      console.error('Failed to add character:', err);
    }
  };

  const handleDeleteCharacter = async (name) => {
    try {
      await fetch(`http://localhost:8888/api/characters/delete/${currentUser.id}/${name}`, { method: 'DELETE' });
      await fetchCharacters();
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <button className="back-btn" onClick={() => navigate('/home')}>← Back to Home</button>
        <h1 className="settings-title">
          <img 
            src="/images/Optionstab.png" 
            alt="Settings Icon" 
            style={{ width: '28px', height: '28px', verticalAlign: 'middle', marginRight: '10px' }}
          />
          Settings
        </h1>

        <img 
          src="/images/400px-Getting_Started_-_Wiki.png" 
          alt="Stardew Valley Banner" 
          className="settings-banner"
        />



        <div className="settings-section">
          <h2>📦 Bundle Type</h2>
          <p>Current: <strong>{bundleType}</strong></p>
          <button onClick={toggleBundleType}>Switch to {bundleType === 'Standard' ? 'Remixed' : 'Standard'}</button>
        </div>

        <div className="settings-section">
          <h2>👥 Manage Characters</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {characters.map(c => (
              <li key={c._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ marginRight: '12px' }}>{c.name}</span>
                <button
                  onClick={() => handleDeleteCharacter(c.name)}
                  style={{ backgroundColor: '#d2a679', color: 'red', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="New character name"
            value={newCharacter}
            onChange={e => setNewCharacter(e.target.value)}
          />
          <button onClick={handleAddCharacter}>+ Add</button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
