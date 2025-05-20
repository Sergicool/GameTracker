import React, { useEffect, useState, useRef } from 'react';
import './Sidebar.css';
import { ChevronLeft, ChevronRight, Calendar, Tag, Globe, LayoutGrid } from 'lucide-react';

const ORIGINS = ["Indie", "Doble A", "Triple A"];
const CATEGORIES = {
  Singleplayer: ["One time story", "Replayable by gameplay", "Recurring by content"],
  Mixto: ["Flexible", "Cooperative"],
  Multijugador: ["PvP", "PvE"]
};

function Sidebar({ isOpen, toggleSidebar, onFilterChange }) {
  const [groupBy, setGroupBy] = useState('All Games');
  const [filterData, setFilterData] = useState({
    genres: [],
    years: [],
    selectedGenres: [],
    selectedYears: [],
    selectedOrigins: [],
    selectedSubcategories: [],
  });
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const resizingRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem('gameTrackerData');
    if (!stored) return;

    const data = JSON.parse(stored);
    setFilterData((prev) => ({
      ...prev,
      genres: data.genres || [],
      years: [...new Set(data.years.map(String))],
    }));
  }, []);

  useEffect(() => {
    onFilterChange?.(filterData);

    let animationFrameId;

    const handleMouseMove = (e) => {
        if (!resizingRef.current) return;

        const updateWidth = () => {
        const newWidth = Math.max(180, Math.min(500, e.clientX));
        setSidebarWidth(newWidth);
        };

        // Cancela frames anteriores y solicita uno nuevo
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(updateWidth);
    };

    const handleMouseUp = () => {
        resizingRef.current = false;
        cancelAnimationFrame(animationFrameId);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        cancelAnimationFrame(animationFrameId);
    };
    }, [filterData, onFilterChange]);

  const handleMouseDown = () => {
    resizingRef.current = true;
  };

  const handleToggle = (key, value) => {
    setFilterData((prev) => {
      const selectedList = prev[key];
      const updatedList = selectedList.includes(value)
        ? selectedList.filter((v) => v !== value)
        : [...selectedList, value];

      return {
        ...prev,
        [key]: updatedList,
      };
    });
  };

  const renderPillList = (label, values, key, icon) => (
    <div className="filter-group">
      <p className="filter-label">
        {icon} {label}
      </p>
      <div className="pill-container">
        {values.map((value) => {
          const isSelected = filterData[key].includes(value);
          return (
            <div
              key={value}
              className={`pill ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggle(key, value)}
            >
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={`sidebar ${isOpen ? 'open' : 'closed'}`}
      style={isOpen ? { width: sidebarWidth } : {}}
    >
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {isOpen && (
        <>
          <div className="sidebar-content">
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="groupBy" className="filter-label">
                  <LayoutGrid size={16} style={{ marginRight: '4px' }} />
                  Agrupar por:
                </label>
                <select
                  id="groupBy"
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                >
                  <option value="All Games">All Games</option>
                  <option value="Genre">Genre</option>
                  <option value="Year">Year</option>
                  <option value="Origin">Origin</option>
                  <option value="Category">Category</option>
                </select>
              </div>

              {/* Géneros con color */}
              <div className="filter-group">
                <p className="filter-label"><Tag size={16} /> Géneros</p>
                <div className="pill-container">
                  {filterData.genres.map((g) => {
                    const isSelected = filterData.selectedGenres.includes(g.genre);
                    return (
                      <div
                        key={g.genre}
                        className={`pill genre ${isSelected ? 'selected' : ''}`}
                        style={{
                          backgroundColor: isSelected ? g.color : '#444',
                          borderColor: isSelected ? g.color : 'transparent',
                          color: isSelected ? '#fff' : '#ccc'
                        }}
                        onClick={() => handleToggle('selectedGenres', g.genre)}
                      >
                        {g.genre}
                      </div>
                    );
                  })}
                </div>
              </div>

              {renderPillList("Años", filterData.years, "selectedYears", <Calendar size={16} />)}
              {renderPillList("Origen", ORIGINS, "selectedOrigins", <Globe size={16} />)}

              <div className="filter-group">
                <p className="filter-label"><LayoutGrid size={16} /> Categorías</p>
                {Object.entries(CATEGORIES).map(([cat, subs]) => (
                  <div key={cat}>
                    <p className="category-title">{cat}</p>
                    <div className="pill-container">
                      {subs.map((sub) => {
                        const isSelected = filterData.selectedSubcategories.includes(sub);
                        return (
                          <div
                            key={sub}
                            className={`pill ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleToggle('selectedSubcategories', sub)}
                          >
                            {sub}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="resizer" onMouseDown={handleMouseDown} />
        </>
      )}
    </div>
  );
}

export default Sidebar;
