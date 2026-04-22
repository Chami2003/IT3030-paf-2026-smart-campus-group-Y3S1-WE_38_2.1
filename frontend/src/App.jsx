import React from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';

function App() {
  return (
    // Background එක සුදු පාටට බලෙන්ම මාරු කළා කළු screen එක නැති කරන්න
    <div className="App" style={{ backgroundColor: 'white', minHeight: '100vh', color: 'black' }}>
      <h1 style={{ textAlign: 'center', marginTop: '20px', color: '#333' }}>
        Smart Campus Operations Hub
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
        <TicketForm />
        <hr style={{ width: '80%', border: '1px solid #eee' }} />
        <TicketList />
      </div>
    </div>
  );
}

export default App;