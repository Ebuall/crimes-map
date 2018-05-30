import { defer, of } from "rxjs";

function formatDate(date) {
  return date
    .toISOString()
    .split("T")[0]
    .split("-")
    .slice(0, -1)
    .join("-");
}

/** Fetch data from police api */
function fDaPolice(path) {
  return defer(() =>
    fetch("https://data.police.uk/api/" + path).then(
      res => (res.ok ? res.json() : Promise.reject(res)),
    ),
  );
}

export function getDefaultCategories() {
  return [{ url: "all-crime", name: "All crime" }];
}

export function getCategories(date) {
  const dateStr = formatDate(date);
  console.log("fetching date", dateStr);
  // return of(getDefaultCategories());
  return fDaPolice("crime-categories?date=" + dateStr);
}

/** broken */
export function crimesAtLocation(date, location) {
  const lat = location.lat.toFixed(6);
  const lng = location.lng.toFixed(6);
  const dateStr = formatDate(date);

  return fDaPolice(`crimes-at-location?date=${dateStr}&lat=${lat}&lng=${lng}`);
}

function makePoly(bounds) {
  const [n, e, s, w] = [
    bounds.getNorth(),
    bounds.getEast(),
    bounds.getSouth(),
    bounds.getWest(),
  ].map(n => n.toFixed(6));

  return `${n},${e}:${s},${e}:${s},${w}:${n},${w}`;
}

export function streetLevel(bounds, date, category) {
  const square = makePoly(bounds);
  console.debug({ square, bounds: bounds.toString() });

  return fDaPolice(
    `crimes-street/${category}?poly=${square}&date=${formatDate(date)}`,
  );
}

export function streetLevelPoint(bounds, date, category) {
  const [lng, lat] = bounds.getCenter().toArray();

  return fDaPolice(
    `crimes-street/${category}?lat=${lat}&lng=${lng}&date=${formatDate(date)}`,
  );
}

const testCrimeData = of([
  {
    category: "anti-social-behaviour",
    location_type: "Force",
    location: {
      latitude: "52.640961",
      street: {
        id: 884343,
        name: "On or near Wharf Street North",
      },
      longitude: "-1.126371",
    },
    context: "",
    outcome_status: null,
    persistent_id: "",
    id: 54164419,
    location_subtype: "",
    month: "2017-01",
  },
  {
    category: "anti-social-behaviour",
    location_type: "Force",
    location: {
      latitude: "52.633888",
      street: {
        id: 883425,
        name: "On or near Peacock Lane",
      },
      longitude: "-1.138924",
    },
    context: "",
    outcome_status: null,
    persistent_id: "",
    id: 54165316,
    location_subtype: "",
    month: "2017-01",
  },
]);
