function uniform(min, max) {
  return (max - min) * Math.random() + min;
}

function split(actions) {
  const maxWeight = actions.reduce((total, action) => {
    return total + action[0];
  }, 0);

  const chance = Math.random() * maxWeight;

  let addedChance = 0;
  for (let action of actions) {
    addedChance += action[0];
    if (chance <= addedChance)
      return typeof action[1] === 'function' ? action[1]() : action[1];
  }

  throw new Error(`No action was executed`);
}

function linearUniform({ x, y, t }) {
  if (typeof t === 'undefined') t = uniform(...x);

  const m = (y[1] - y[0]) / (x[1] - x[0]);
  const n = y[0] - m * x[0];

  return m * t + n;
}

function roundTo(amoutToRoundTo, number) {
  return Math.round(number * (1 / amoutToRoundTo)) / (1 / amoutToRoundTo);
}

const API = {
  split,
  linearUniform,
  uniform,
  roundTo,
};

export default API;
