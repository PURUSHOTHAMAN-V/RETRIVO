import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const linkClass = ({ isActive }) => isActive ? 'active' : undefined
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/user/report-lost" className={linkClass}>Report Lost</NavLink>
        <NavLink to="/user/report-found" className={linkClass}>Report Found</NavLink>
        <NavLink to="/user/search" className={linkClass}>Search</NavLink>
        <NavLink to="/user/rewards" className={linkClass}>Rewards</NavLink>
      </nav>
    </aside>
  )
}








