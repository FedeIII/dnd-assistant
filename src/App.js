import { useState } from 'react';
import screens from './screens/constants';
import RollDice from './screens/rollDice';
import './App.scss';

function App() {
  const [screen, setScreen] = useState(null);

  return (
    <div className="App">
      <header className="header">
        DnD Assistant
      </header>
      <div className="body">
        <div className="sidebar">
          <button onClick={() => setScreen(screens.ROLL)}>Roll Dice</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </div>
        <div className="content">
          {(!screen) && <div>Welcome</div>}
          {(screen == screens.ROLL) && <RollDice />}
        </div>
      </div>
    </div>
  );
}

export default App;
