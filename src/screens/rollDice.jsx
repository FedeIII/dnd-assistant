import { useState, Fragment, useMemo } from 'react';

// 2d6      2d20
// 2d6+1    2d20+1
// 2d6-1    2d20-1
// 2d6r1    2d20r1
// 2d6p1    2d20p1
// 2d6r1+1  2d20r1+1
// 2d6r1-1  2d20r1-1
// 2d6p1+1  2d20p1+1
// 2d6p1-1  2d20p1-1

function getNumberOfDice(command) {
  const numberOfDice = command.substring(0, command.indexOf('D'));
  return Number(numberOfDice) || 0;
}

function getNumberOfFaces(command) {
  const indexOfD = command.indexOf('D');

  let endIndexForFaces = command.length;
  const indexOfDiceSelector = command.search(/[RP]/);
  const indexOfModifier = command.search(/[+-]/);
  if (indexOfDiceSelector !== -1) endIndexForFaces = indexOfDiceSelector;
  else if (indexOfModifier !== -1) endIndexForFaces = indexOfModifier;

  const numberOfFaces = command.substring(indexOfD + 1, endIndexForFaces);
  return Number(numberOfFaces) || 0;
}

function getNumberOfSelectedDice(command, selector) {
  const indexOfRemovedDice = command.indexOf(selector);
  if (indexOfRemovedDice === -1) return null;

  const indexOfModifier = command.search(/[+-]/);

  let endIndexForRemovedDice = command.length;

  if (indexOfModifier !== -1) endIndexForRemovedDice = indexOfModifier;

  const numberOfSelectedDice = command.substring(
    indexOfRemovedDice + 1,
    endIndexForRemovedDice
  );
  return Number(numberOfSelectedDice) || 0;
}

function getModifier(command) {
  const indexOfModifier = command.search(/[+-]/);

  if (indexOfModifier === -1) return null;

  const modifier = command.substring(indexOfModifier);
  return Number(modifier) || 0;
}

function processCommand(command) {
  const normalizedCommand = command
    .replace(' ', '')
    .replace('d', 'D')
    .replace('r', 'R')
    .replace('p', 'P');

  const numberOfDice = getNumberOfDice(normalizedCommand);
  const numberOfFaces = getNumberOfFaces(normalizedCommand);
  const numberOfRemovedDice = getNumberOfSelectedDice(normalizedCommand, 'R');
  const numberOfPickedDice = getNumberOfSelectedDice(normalizedCommand, 'P');
  const modifier = getModifier(normalizedCommand);

  const rolls = [...Array(numberOfDice)].map((_, i) => ({
    i,
    faces: numberOfFaces,
    value: Math.ceil(Math.random() * numberOfFaces),
  }));

  return {
    rolls,
    modifier,
    remove: numberOfRemovedDice,
    pick: numberOfPickedDice,
  };
}

function rollLevel(value, faces, isAccounted) {
  if (!isAccounted) {
    return 'disabled';
  }

  if (value === faces) {
    return 'high';
  }

  if (value === 1) {
    return 'low';
  }

  return '';
}

function SingleRoll(props) {
  const {
    roll: { value, faces },
    isAccounted,
  } = props;

  return (
    <span className={`roll ${rollLevel(value, faces, isAccounted)}`}>
      {value}
    </span>
  );
}

function getPickIndices(rolls, pick) {
  const sortedRolls = rolls
    .slice()
    .sort((roll1, roll2) => roll2.value - roll1.value);

  return sortedRolls.slice(0, pick).map(roll => roll.i);
}

function getRemoveIndices(rolls, remove) {
  const sortedRolls = rolls
    .slice()
    .sort((roll1, roll2) => roll1.value - roll2.value);

  return sortedRolls.slice(remove).map(roll => roll.i);
}

function AllRolls(props) {
  const { rolls, modifier, usedIndices } = props;

  if (rolls.length) {
    return (
      <>
        {rolls.map((roll, index) => (
          <Fragment key={index}>
            {!!index && '+'}
            <SingleRoll roll={roll} isAccounted={usedIndices.includes(index)} />
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

function TotalRoll(props) {
  const { rolls, modifier, usedIndices } = props;

  return (
    <span className="history-line-total">
      {rolls.reduce(
        (total, roll) =>
          usedIndices.includes(roll.i) ? total + roll.value : total,
        modifier
      )}
    </span>
  );
}

function useUsedIndices(result) {
  const { rolls, pick, remove } = result;
  return useMemo(() => {
    let usedIndices;
    if (pick) {
      usedIndices = getPickIndices(rolls, pick);
    } else if (remove) {
      usedIndices = getRemoveIndices(rolls, remove);
    } else {
      usedIndices = Array.from(rolls, (_, i) => i);
    }

    return usedIndices;
  }, [rolls, pick, remove]);
}

function Line(props) {
  const { command, result } = props;

  const usedIndices = useUsedIndices(result);

  return (
    <div className="history-line" key={command}>
      <span className="history-line-command">/{command}</span>
      <div className="history-line-rolls">
        <AllRolls {...result} usedIndices={usedIndices} />
        {' = '}
        <TotalRoll {...result} usedIndices={usedIndices} />
      </div>
    </div>
  );
}

function RollDice() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);

  const onCommandChange = event => {
    setCommand(event.target.value);
  };

  const onCommandSubmit = event => {
    event.preventDefault();

    if (command) {
      setCommand('');
      const result = processCommand(command);
      setHistory(history.concat({ command, result }));
    }
  };

  return (
    <div className="terminal">
      <div className="history">
        {history.map((line, index) => (
          <Line {...line} key={index} />
        ))}
        <div id="history-anchor" />
      </div>
      <form onSubmit={onCommandSubmit}>
        <input className="command" value={command} onChange={onCommandChange} />
        <input type="submit" className="submit-command" />
      </form>
    </div>
  );
}

export default RollDice;
