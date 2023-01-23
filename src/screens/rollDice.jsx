import { useState, Fragment } from 'react';

function processCommand(command) {
  const normalizedCommand = command.replace(' ', '').replace('d', 'D');

  const splitByD = normalizedCommand.split('D')
  const splitByMod = splitByD[1].split(/[+-]+/);
  const splitByFaces = splitByD[1].split(/\d(?=[+-]+)/);

  const numberOfDices = Number(splitByD[0]);
  const numberOfFaces = Number(splitByMod[0]);
  const modifier = Number(splitByFaces[1]);

  const rolls = [...Array(numberOfDices)].map(
    () => ({
      faces: numberOfFaces,
      value: Math.ceil(Math.random() * numberOfFaces),
    }),
  );

  return { rolls, modifier };
}

function rollLevel(value, faces) {
  if (value == faces) {
    return 'high';
  }

  if (value == 1) {
    return 'low';
  }

  return '';
}

function SingleRoll(props) {
  const { roll: { value, faces } } = props;

  return <span className={`roll ${rollLevel(value, faces)}`}>{value}</span>;
}

function AllRolls(props) {
  const { rolls, modifier } = props;

  if (rolls.length) {
    return (
      <>
        {rolls.map((roll, index) => (
          <Fragment key={index}>
            {!!index && '+'}
            <SingleRoll roll={roll}/>
          </Fragment>
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

  return null;
}

function Result(props) {
  const { rolls, modifier } = props;

  return (
    <span className="history-line-result">
      {rolls.reduce((result, roll) => result + roll.value, modifier)}
    </span>
  );
}

function Line(props) {
  const {
    command,
    result: { rolls, modifier }
  } = props;

  return (
    <div className="history-line" key={command}>
      <span className="history-line-command">/{command}</span>
      <div className="history-line-rolls">
        <AllRolls rolls={rolls} modifier={modifier} />
        {' = '}
        <Result rolls={rolls} modifier={modifier} />
      </div>
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
