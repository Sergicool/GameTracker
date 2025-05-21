import React, { useEffect, useState, useRef } from 'react';
import './Sidebar.css';
import { ChevronLeft, ChevronRight, Calendar, Tag, Globe, LayoutGrid } from 'lucide-react';
import { getItem } from '../utils/db';

const ORIGINS = ["Indie", "Doble A", "Triple A"];
const CATEGORIES = {
  Singleplayer: ["One time story", "Replayable by gameplay", "Recurring by content"],
  Mixto: ["Flexible", "Cooperative"],
  Multijugador: ["PvP", "PvE"]
};

function Sidebar({ isOpen, toggleSidebar, onFilterChange, showGroupBy = true }) {
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
    async function fetchData() {
      const stored = await getItem('gameTrackerData');
      if (!stored) return;

      setFilterData((prev) => ({
        ...prev,
        genres: (stored.genres || []).slice().sort((a, b) => a.genre.localeCompare(b.genre)),
        years: Array.isArray(stored.years) ? [...new Set(stored.years.map(String))] : [],
      }));
    }

    fetchData();
  }, []);

  useEffect(() => {
    onFilterChange?.({ ...filterData, groupBy });
  }, [filterData, groupBy]); // Se ejecuta solo cuando cambian estos valores

  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (!resizingRef.current) return;

      const updateWidth = () => {
        const newWidth = Math.max(180, Math.min(500, e.clientX));
        setSidebarWidth(newWidth);
      };

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
  }, []); // <- Solo se ejecuta una vez al montar

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
      <hr className="divider" />
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        {isOpen && <h2 className="sidebar-title">Games Filter</h2>}
      </div>

      {isOpen && (
        <>
          <div className="sidebar-content">
            <div className="filters">
              {showGroupBy && (
                <div className="filter-group">
                  <label htmlFor="groupBy" className="filter-label">
                    <LayoutGrid size={20} style={{ marginRight: '6px' }} /> Group by:
                  </label>
                  <hr className="divider" />
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
              )}

              {/* Géneros con color */}
              <div className="filter-group">
                <p className="filter-label"><Tag size={20} style={{ marginRight: '6px' }} /> Genres</p>
                <hr className="divider" />
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

              {renderPillList("Years", filterData.years, "selectedYears", <Calendar size={20} style={{ marginRight: '6px' }} />)}
              {renderPillList("Origin", ORIGINS, "selectedOrigins", <Globe size={20} style={{ marginRight: '6px' }} />)}

              <div className="filter-group">
                <p className="filter-label"><LayoutGrid size={20} style={{ marginRight: '6px' }} /> Categories</p>
                <hr className="divider" />
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
