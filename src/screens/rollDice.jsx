import { useState } from 'react';

function RollDice() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);

  const onCommandChange = event => {
    setCommand(event.target.value);
  }

  const onCommandSubmit = event => {
    event.preventDefault();

    if (command) {
      setCommand('');
      setHistory(history.concat(command));
    }
  };

  return (
      <div className="terminal">
        <div className="history">
          {history.map(line => <p key={line} className="history-line">{line}</p>)}
          <div id="history-anchor" />
        </div>
        <form onSubmit={onCommandSubmit}>
          <input className="command" value={command} onChange={onCommandChange}/>
          <input type="submit" className="submit-command"/>
        </form>
      </div>
  );
}

export default RollDice;
