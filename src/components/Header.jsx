import React from 'react';
import { NavLink } from 'react-router-dom';
import MenuButton from './MenuButton';
import './Header.css';

function Header() {
  return (
    <nav className="header">
      <div className="nav-links">
        <NavLink to="/TierList" className={({ isActive }) => isActive ? 'active' : ''}>
          Tier List
        </NavLink>
        <NavLink to="/Games" className={({ isActive }) => isActive ? 'active' : ''}>
          Games
        </NavLink>
        <NavLink to="/HallOfFame" className={({ isActive }) => isActive ? 'active' : ''}>
          Hall Of Fame
        </NavLink>
      </div>
      <div className="side-menu">
        <MenuButton />
      </div>
    </nav>
  );
}

export default Header;
