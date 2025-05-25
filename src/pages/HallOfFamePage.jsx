import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import GameCard from '../components/GameCard';
import { getItem } from '../utils/db';
import './HallOfFamePage.css';

const ORIGINS = ["Indie", "Doble A", "Triple A"];

const CATEGORIES = {
  Singleplayer: ["One time story", "Replayable by gameplay", "Recurring by content"],
  Mixto: ["Flexible", "Cooperative"],
  Multijugador: ["PvP", "PvE"]
};

function HallOfFamePage() {
  const [data, setData] = useState(null);
  const [filterType, setFilterType] = useState("favorites");
  const [filterValue, setFilterValue] = useState(null);

  useEffect(() => {
    getItem('gameTrackerData')
      .then(result => {
        if (result) setData(result);
        else console.warn('No data found in IndexedDB.');
      })
      .catch(err => console.error(err));
  }, []);

  const gamesWithPosition = useMemo(() => {
    return (data?.games || []).filter(g => g.globalPosition != null);
  }, [data]);

  const filteredGames = useMemo(() => {
    if (!data) return [];

    if (filterType === "favorites") return [];

    if (filterType === "global") return gamesWithPosition;

    if (filterType === "genre") {
      return gamesWithPosition.filter(game =>
        game.genres.includes(filterValue)
      );
    }

    if (filterType === "year") {
      return gamesWithPosition.filter(game => parseInt(game.year) === parseInt(filterValue));
    }

    if (filterType === "origin") {
      return gamesWithPosition.filter(game => game.origin === filterValue);
    }

    if (filterType === "category-subcategory") {
      return gamesWithPosition.filter(
        game =>
          game.category === filterValue.category &&
          game.subcategory === filterValue.subcategory
      );
    }

    return [];
  }, [filterType, filterValue, gamesWithPosition, data]);

  const favoriteByYear = useMemo(() => {
    const bestPerYear = {};
    for (const year of data?.years || []) {
      const gamesOfYear = gamesWithPosition
        .filter(g => parseInt(g.year) === year)
        .sort((a, b) => a.globalPosition - b.globalPosition);

      if (gamesOfYear.length) bestPerYear[year] = gamesOfYear[0];
    }
    return bestPerYear;
  }, [data, gamesWithPosition]);

  if (!data) {
    return <div className="hall-of-fame-page">Cargando datos...</div>;
  }

  return (
    <div className="hall-of-fame-page">
      <div className="subheader">
        <button onClick={() => setFilterType("favorites")}>Favorites of all years</button>
        <button onClick={() => { setFilterType("global"); setFilterValue(null); }}>Global Top</button>
        <Dropdown 
          options={data.genres.map(g => g.genre)} 
          onSelect={val => { 
            setFilterType("genre"); 
            setFilterValue(val); }} 
          label="Top by Genre" 
        />
        <Dropdown
          options={data.years.map(year => year.toString())}
          onSelect={val => {
            setFilterType("year");
            setFilterValue(val);
          }}
          label="Top by Year"
        />
        <Dropdown 
          options={ORIGINS} 
          onSelect={val => { 
            setFilterType("origin"); 
            setFilterValue(val); }} 
          label="Top by Origin" 
        />
        <Dropdown
          options={Object.entries(CATEGORIES).flatMap(([category, subcategories]) =>
            subcategories.map(sub => ({
              label: `${category} - ${sub}`,
              value: { category, subcategory: sub }
            }))
          )}
          onSelect={(val) => {
            setFilterType("category-subcategory");
            setFilterValue(val);
          }}
          label="Top by Category"
        />
      </div>

      <div className="leaderboard-wrapper">
        <h2 className="leaderboard-title">
          {filterType === "favorites" ? "Favorites of all years" : (() => {
            switch (filterType) {
              case "global":
                return "Global Top";
              case "year":
                return `Top of ${filterValue}`;
              case "genre":
                return `Top of ${filterValue}`;
              case "origin":
                return `Top of ${filterValue}`;
              case "category-subcategory":
                return `Top of ${filterValue?.category} - ${filterValue?.subcategory}`;
              default:
                return null;
            }
          })()}
        </h2>

        {filterType === "favorites" && (
          <div className="favorites-by-year">
            {Object.entries(favoriteByYear).map(([year, game]) => (
              <div key={year} className="favorite-year-block">
                <h2>{year}</h2>
                <GameCard game={game} genresWithColors={data.genres} />
              </div>
            ))}
          </div>
        )}

        {filterType !== "favorites" && (
          <div className="leaderboard">
            {filteredGames
              .sort((a, b) => a.globalPosition - b.globalPosition)
              .map((game, index) => (
                <div
                  key={game.name}
                  className={`leaderboard-entry position-${index + 1}`}
                >
                  <span className="position-number">{index + 1}</span>
                  <img src={game.image} className="leaderboard-image" alt={game.name} />
                  <span className="leaderboard-name">{game.name}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Dropdown({ options, onSelect, label }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="subheader-dropdown" ref={dropdownRef}>
      <button onClick={() => setOpen(prev => !prev)} className="subheader-dropdown-button">
        {label} {open ? <ChevronUp size={16} style={{ marginLeft: "0.5rem" }} /> : <ChevronDown size={16} style={{ marginLeft: "0.5rem" }} />}
      </button>
      {open && (
        <ul className="subheader-dropdown-menu">
          {options.map(opt => (
            <li
              key={typeof opt === 'string' ? opt : opt.label}
              onClick={() => {
                onSelect(typeof opt === 'string' ? opt : opt.value);
                setOpen(false);
              }}
            >
              {typeof opt === 'string' ? opt : opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default HallOfFamePage;
