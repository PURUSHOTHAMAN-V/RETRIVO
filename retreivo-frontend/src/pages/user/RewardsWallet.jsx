import React from 'react'

export default function RewardsWallet(){
  const activities = [
    { id:1, label:'Found Item Report', coins:+50 },
    { id:2, label:'Successful Match', coins:+100 },
    { id:3, label:'Daily Login', coins:+5 },
  ]
  const balance = 450
  return (
    <div className="container" style={{marginTop: '24px'}}>
      <h2>Rewards Wallet</h2>
      <div className="grid grid-2">
        <div className="card">
          <div style={{fontSize:32, fontWeight:800}}>{balance} coins</div>
          <div style={{color:'#475569'}}>Next milestone: 500 coins</div>
        </div>
        <div className="card">
          <strong>Recent earnings</strong>
          {activities.map(a => (
            <div key={a.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #e2e8f0'}}>
              <div>{a.label}</div>
              <div style={{color:'#16a34a'}}>+{a.coins}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}





