import { useState } from 'react';
import screens from './screens/constants';
import RollDice from './screens/rollDice';
import Places from './screens/places';
import './App.scss';

function App() {
  const [screen, setScreen] = useState(null);

  return (
    <div className="App">
      <header className="header">DnD Assistant</header>
      <div className="body">
        <div className="sidebar">
          <button onClick={() => setScreen(screens.ROLL)}>Dados</button>
          <button onClick={() => setScreen(screens.PLACES)}>Lugares</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </div>
        <div className="content">
          {!screen && <div>Welcome</div>}
          {screen === screens.ROLL && <RollDice />}
          {screen === screens.PLACES && <Places />}
        </div>
      </div>
    </div>
  );
}

export default App;
