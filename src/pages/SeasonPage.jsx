import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { seasonBundles } from '../data/seasonData';
import Navbar from '../components/Navbar';
import './SeasonPage.css';

export default function SeasonPage() {
  const { seasonName } = useParams();
  const navigate = useNavigate();

  const [characters, setCharacters] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState('');
  const [checked, setChecked] = useState({});

  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const savedCharacters = JSON.parse(localStorage.getItem('characters')) || [];
    setCharacters(savedCharacters);

    if (savedCharacters.length > 0 && !currentCharacter) {
      setCurrentCharacter(savedCharacters[0]);
    }
  }, [currentCharacter]);

  useEffect(() => {
    if (currentCharacter) {
      const saved = JSON.parse(localStorage.getItem(`checklist-${currentCharacter}`)) || {};
      setChecked(saved);
    }
  }, [seasonName, currentCharacter]);

  const handleCheck = (bundle, task) => {
    const key = `${bundle}-${task}`;
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem(`checklist-${currentCharacter}`, JSON.stringify(updated));
  };

  const tasks = seasonBundles[seasonName.toLowerCase()] || [];

  return (
    <>
      <Navbar />

      <div className="season-page">
        <h1>
          {seasonName.charAt(0).toUpperCase() + seasonName.slice(1)} Season Checklist
        </h1>

        {/* ✅ Character selection drop-down box*/}
        <div className="character-select">
          <label>
            Current Character:{' '}
            <select
              value={currentCharacter}
              onChange={(e) => setCurrentCharacter(e.target.value)}
            >
              {characters.map((char) => (
                <option key={char} value={char}>
                  {char}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul>
          {tasks.map(({ bundle, task }) => {
            const key = `${bundle}-${task}`;
            return (
              <li key={key}>
                <label>
                  <input
                    type="checkbox"
                    checked={!!checked[key]}
                    onChange={() => handleCheck(bundle, task)}
                  />
                  [{bundle}] {task}
                </label>
              </li>
            );
          })}
        </ul>

        {currentCharacter && (
          <button onClick={() => navigate(`/character/${currentCharacter}`)}>
           ← Back to {currentCharacter}'s Checklist
          </button>
        )}

        
      </div>
    </>
  );
}
