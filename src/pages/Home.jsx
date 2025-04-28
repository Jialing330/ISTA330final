import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { checklistData } from '../data/checklistData';
import './Home.css';

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [progressData, setProgressData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchCharactersAndProgress = async () => {
      try {
        const charRes = await fetch(`http://localhost:8888/api/characters/${currentUser.id}`);
        const charData = await charRes.json();
        const characterList = charData.characters || [];
        setCharacters(characterList);

        const newProgress = {};

        for (const char of characterList) {
          const allRes = await fetch(`http://localhost:8888/api/checklist/load?userId=${currentUser.id}&character=${char.name}&season=AllChecklist`);
          const allData = await allRes.json();
          const dbItems = allData.items || [];
          const standardItems = Object.values(checklistData).flat();

          const completed = standardItems.filter(task => {
            const match = dbItems.find(dbItem => dbItem.name === task);
            return match && match.checked;
          }).length;

          const total = standardItems.length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          newProgress[char.name] = percentage;
        }

        setProgressData(newProgress);
      } catch (err) {
        console.error('❌ Error occurred when loading the character or checklist:', err);
      }
    };

    fetchCharactersAndProgress();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="home-page">
        <h1>Welcome to the Community Center!</h1>
        <div className="card-container">
          {characters.map((char) => {
            const completion = progressData[char.name] || 0;
            return (
              <div className="farm-card" key={char._id}>
                <h2>{char.name}</h2>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${completion}%` }}></div>
                </div>
                <p>{completion}% Complete</p>
                <button onClick={() => navigate(`/character/${char.name}`)}>View Details</button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
