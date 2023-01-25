import { useEffect, useState } from 'react';
import random from '../../utils/random';
import styles from './places.module.scss';

const noOp = () => {};

const VILLAGE = {
  minPopulation: 20,
  maxPopulation: 500,
  roundPopulation: 10,
  minSecurity: 2,
  maxSecurity: 25,
};

const TOWN = {
  minPopulation: 1000,
  maxPopulation: 5000,
  roundPopulation: 500,
};

const CITY = {
  minPopulation: 10000,
  maxPopulation: 25000,
  roundPopulation: 5000,
};

function SizeSelect(props) {
  const { setPlace } = props;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.mainOption} ${styles.village}`}
        onClick={() =>
          setPlace(prevPlace => ({ ...prevPlace, config: VILLAGE }))
        }
      >
        <span className={styles.optionLabel}>Aldea</span>
      </div>
      <div
        className={`${styles.mainOption} ${styles.town}`}
        onClick={() => setPlace(prevPlace => ({ ...prevPlace, config: TOWN }))}
      >
        <span className={styles.optionLabel}>Pueblo</span>
      </div>
      <div
        className={`${styles.mainOption} ${styles.city}`}
        onClick={() => setPlace(prevPlace => ({ ...prevPlace, config: CITY }))}
      >
        <span className={styles.optionLabel}>Ciudad</span>
      </div>
    </div>
  );
}

function getPopulation(PLACE) {
  const population = random.uniform(PLACE.minPopulation, PLACE.maxPopulation);
  return random.roundTo(PLACE.roundPopulation, population);
}

function getVillageSecurity(population) {
  const security = {};

  const securityAmount = random.roundTo(
    1,
    random.linearUniform({
      x: [VILLAGE.minPopulation, VILLAGE.maxPopulation],
      y: [VILLAGE.minSecurity, VILLAGE.maxSecurity],
      t: population,
    })
  );

  random.split([
    [50, () => (security.guards = securityAmount)],
    [50, () => (security.militia = securityAmount)],
  ]);

  return security;
}

function getVillageReligion() {
  const religion = {};
  random.split([
    [25, () => (religion.temple = true)],
    [25, () => (religion.shrine = true)],
    [50, noOp],
  ]);
  return religion;
}

function VillageDetails(props) {
  const { place, setPlace } = props;
  const { name, population, government, security = {}, religion = {} } = place;

  useEffect(() => {
    const population = getPopulation(VILLAGE);
    const government = random.split([
      [50, true],
      [50, false],
    ]);
    const security = getVillageSecurity(population);
    const religion = getVillageReligion();

    setPlace(prevPlace => ({
      ...prevPlace,
      name: 'Placeholder Name',
      population,
      government,
      security,
      religion,
    }));
  }, [setPlace]);

  return (
    <div className={styles.container}>
      <div className={styles.data}>Aldea</div>
      <div className={styles.data}>{name}</div>
      <div className={styles.data}>Población: ~{population}</div>
      <div className={styles.data}>
        Gobierno: Alguacil {!government && 'no '}presente
      </div>
      <div className={styles.data}>
        <span>Seguridad: </span>
        {security.guards && <span>{security.guards} guardias</span>}
        {security.militia && <span>{security.militia} milicias</span>}
      </div>
      {(religion.temple || religion.shrine) && (
        <div className={styles.data}>
          Religión: Un {religion.temple ? 'templo' : 'santuario'}
        </div>
      )}
    </div>
  );
}

function TownDetails(props) {
  const { place, setPlace } = props;

  useEffect(() => {
    setPlace(prevPlace => ({
      ...prevPlace,
      name: 'Placeholder Name',
      population: getPopulation(TOWN),
    }));
  }, [setPlace]);

  return (
    <div className={styles.container}>
      <div className={styles.placeSize}>Pueblo</div>
      <div className={styles.placeName}>{place.name}</div>
      <div className={styles.population}>Población: ~{place.population}</div>
    </div>
  );
}

function CityDetails(props) {
  const { place, setPlace } = props;

  useEffect(() => {
    setPlace(prevPlace => ({
      ...prevPlace,
      name: 'Placeholder Name',
      population: getPopulation(CITY),
    }));
  }, [setPlace, place.config]);

  return (
    <div className={styles.container}>
      <div className={styles.placeSize}>Ciudad</div>
      <div className={styles.placeName}>{place.name}</div>
      <div className={styles.population}>Población: ~{place.population}</div>
    </div>
  );
}

function PlaceDetails(props) {
  const { place, setPlace } = props;

  switch (place.config) {
    default:
    case VILLAGE:
      return <VillageDetails place={place} setPlace={setPlace} />;
    case TOWN:
      return <TownDetails place={place} setPlace={setPlace} />;
    case CITY:
      return <CityDetails place={place} setPlace={setPlace} />;
  }
}

export default function Places() {
  const [place, setPlace] = useState({ config: null });

  if (place.config === null) {
    return <SizeSelect setPlace={setPlace} />;
  } else {
    return <PlaceDetails place={place} setPlace={setPlace} />;
  }
}
