import { useState } from 'react';

Object.setPrototypeOf(Number.prototype, {
  *[Symbol.iterator]() {
    const start = 1;
    const end = Number(this);

    for (let i = start; i <= end; ++i) {
      yield i;
    }
  },
});

function processCommand(command) {
  const normalizedCommand = command.replace(' ', '').replace('d', 'D');

  const splitByD = normalizedCommand.split('D')
  const splitByMod = splitByD[1].split(/[+-]+/);
  const splitByFaces = splitByD[1].split(/\d(?=[+-]+)/);

  const numberOfDices = Number(splitByD[0]);
  const numberOfFaces = Number(splitByMod[0]);
  const modifier = Number(splitByFaces[1]);

  const rolls = [...numberOfDices].map(
    () => Math.ceil(Math.random() * numberOfFaces),
  );

  return { rolls, modifier };
}

function Roll(props) {
  const { roll } = props;

  return roll;
}

function Result(props) {
  const { rolls, modifier } = props;

  if (rolls.length) {
    return (
      <>
        {rolls.map((roll, index) => (
          <>
            {!!index && '+'}
            <Roll roll={roll} key={index}/>
          </>
        ))}
        {!!modifier && (
          <span className="modifier">
            {modifier > 0 && '+'}
            {modifier}
          </span>
        )}
      </>
    );
  }

  return `${rolls} ${modifier}`;
}

function Line(props) {
  const {
    command,
    result: { rolls, modifier }
  } = props;

  return (
    <div className="history-line" key={command}>
      <span className="history-line-command">/{command}</span>
      <span className="history-line-result">
        <Result rolls={rolls} modifier={modifier}/>
      </span>
    </div>
  );
}

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
      const result = processCommand(command);
      setHistory(
        history.concat({ command, result }),
      );
    }
  };

  return (
      <div className="terminal">
        <div className="history">
          {history.map((line, index) => <Line {...line} key={index} />)}
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
