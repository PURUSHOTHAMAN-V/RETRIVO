import React from 'react'

const CLAIMS = [
  { id:1, item:'Black iPhone 12', date:'2025-08-01', step:3, next:'Ownership Verification', hub:'Central City Hub' },
  { id:2, item:'Leather Wallet', date:'2025-07-22', step:5, next:'Collection', hub:'East Metro Hub' },
]

function Timeline({ step }){
  const steps = ['Claim Submitted','Identity Verified','Ownership Verified','Hub Review','Collection']
  return (
    <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
      {steps.map((s,i)=>(
        <div key={s} style={{display:'flex', alignItems:'center', gap:6}}>
          <div style={{width:10, height:10, borderRadius:999, background: i<step? '#22c55e' : '#e2e8f0'}} />
          <span style={{fontSize:12}}>{s}</span>
          {i<steps.length-1 && <div style={{width:30, height:2, background:'#e2e8f0'}} />}
        </div>
      ))}
    </div>
  )
}

export default function MyClaims(){
  return (
    <div className="container" style={{marginTop: '24px'}}>
      <h2>My Claims</h2>
      <div className="grid">
        {CLAIMS.map(c => (
          <div key={c.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700}}>{c.item}</div>
                <div style={{color:'#475569', fontSize:12}}>Submitted {c.date} • {c.hub}</div>
              </div>
              <button className="btn">View</button>
            </div>
            <div style={{marginTop:12}}>
              <Timeline step={c.step} />
            </div>
            <div style={{marginTop:8, fontSize:12, color:'#475569'}}>Next action: {c.next}</div>
          </div>
        ))}
      </div>
    </div>
  )
}





