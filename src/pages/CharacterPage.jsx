import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { checklistData, seasonBundles } from '../data/checklistData';
import './CharacterPage.css';

export default function CharacterPage() {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const [allChecklist, setAllChecklist] = useState({});
  const [season, setSeason] = useState('spring');
  const [seasonChecklist, setSeasonChecklist] = useState({});
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) return;
    fetchAllChecklist();
    fetchSeasonChecklist(season);
  }, [characterName, season]);

  const fetchAllChecklist = async () => {
    try {
      const res = await fetch(`http://localhost:8888/api/checklist/load?userId=${currentUser.id}&character=${characterName}&season=AllChecklist`);
      const data = await res.json();
      const loaded = {};
      if (data.items) {
        data.items.forEach(item => {
          loaded[item.name] = item.checked;
        });
      }
      setAllChecklist(loaded);
    } catch (err) {
      console.error('❌ AllChecklist cannot processing:', err);
    }
  };

  const fetchSeasonChecklist = async (selectedSeason) => {
    try {
      const res = await fetch(`http://localhost:8888/api/checklist/load?userId=${currentUser.id}&character=${characterName}&season=${selectedSeason}`);
      const data = await res.json();
      const loaded = {};
      if (data.items) {
        data.items.forEach(item => {
          loaded[item.name] = item.checked;
        });
      }
      setSeasonChecklist(loaded);
    } catch (err) {
      console.error('❌ SeasonChecklist cannot processing:', err);
    }
  };

  const handleAllChecklistChange = async (itemName) => {
    const updated = { ...allChecklist, [itemName]: !allChecklist[itemName] };
    setAllChecklist(updated);

    try {
      const formattedItems = Object.keys(updated).map(name => ({
        name,
        checked: updated[name],
      }));

      await fetch('http://localhost:8888/api/checklist/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          character: characterName,
          season: 'AllChecklist',
          items: formattedItems,
        }),
      });
    } catch (err) {
      console.error('❌ Save AllChecklist error:', err);
    }
  };

  const handleSeasonChecklistChange = async (itemName) => {
    const updated = { ...seasonChecklist, [itemName]: !seasonChecklist[itemName] };
    setSeasonChecklist(updated);

    const updatedAll = { ...allChecklist, [itemName]: !allChecklist[itemName] };
    setAllChecklist(updatedAll);

    try {
      const seasonItems = Object.keys(updated).map(name => ({
        name,
        checked: updated[name],
      }));

      const allItems = Object.keys(updatedAll).map(name => ({
        name,
        checked: updatedAll[name],
      }));

      await fetch('http://localhost:8888/api/checklist/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          character: characterName,
          season: season,
          items: seasonItems,
        }),
      });

      await fetch('http://localhost:8888/api/checklist/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          character: characterName,
          season: 'AllChecklist',
          items: allItems,
        }),
      });
    } catch (err) {
      console.error('❌ Save SeasonChecklist or AllChecklist error:', err);
    }
  };

  const handleSeasonChange = (newSeason) => {
    setSeason(newSeason);
  };

  if (!currentUser) return null;

  return (
    <>
      <Navbar />
      <div className="character-page">
        <h1>🧹 Character Checklist: {characterName}</h1>

        <h2>Overall Progress</h2>
        <div className="checklist-section">
          {Object.keys(checklistData).map(room => (
            <div key={room} className="room-section">
              <h3>{room}</h3>
              <ul>
                {checklistData[room].map(item => (
                  <li key={item}>
                    <input
                      type="checkbox"
                      checked={allChecklist[item] || false}
                      onChange={() => handleAllChecklistChange(item)}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/home')}> ← Back to Home</button>

        <h2>🌿 Seasonal Checklists</h2>
        <div className="season-buttons">
          {['spring', 'summer', 'fall', 'winter'].map(s => (
            <button
              key={s}
              onClick={() => handleSeasonChange(s)}
              style={{ margin: '0 5px' }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="season-checklist">
          <ul>
            {seasonBundles[season]?.map(bundle => (
              <li key={bundle.task}>
                <input
                  type="checkbox"
                  checked={seasonChecklist[bundle.task] || false}
                  onChange={() => handleSeasonChecklistChange(bundle.task)}
                />
                {bundle.task} ({bundle.bundle})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
