import React from 'react'
import Sidebar from '../../components/common/Sidebar'

export default function UserDashboard() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <h2>Welcome back</h2>
        <div className="grid grid-2">
          <div className="card"><strong>Reports</strong><p>Your recent lost/found reports.</p></div>
          <div className="card"><strong>Rewards</strong><p>Balance and recent activity.</p></div>
        </div>
      </main>
    </div>
  )
}






