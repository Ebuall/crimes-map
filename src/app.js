import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import { of, combineLatest } from "rxjs";
import {
  switchMap,
  startWith,
  tap,
  catchError,
  shareReplay,
  withLatestFrom,
} from "rxjs/operators";
import * as api from "./api";
import { initMap } from "./map";
import { initDatePicker } from "./datePicker.jsx";
import { initCategoryPicker } from "./categoryPicker.jsx";
import { initMethodPicker } from "./methodPicker.jsx";
import { capitalize, cropData } from "./helpers";

const { repaint$ } = initMap();

const { selectDate$ } = initDatePicker();

const categoriesList$ = selectDate$.pipe(
  switchMap(api.getCategories),
  startWith(api.getDefaultCategories()),
  // tap(l => console.log("cat list", l.map(c => c.url))),
  shareReplay(1),
);

const { selectCategory$ } = initCategoryPicker(categoriesList$);
// const { selectMethod$ } = initMethodPicker();

const crime$ = combineLatest(
  repaint$,
  selectDate$,
  selectCategory$,
  // selectMethod$,
  of("streetLevel"),
).pipe(
  switchMap(([mapElem, date, category, method]) => {
    const zoom = mapElem.getZoom();
    if (zoom < 12 && category == "all-crime") return of([]);

    const bounds = mapElem.getBounds();
    const center = bounds.getCenter();
    console.debug({ zoom, center });

    return api[method](bounds, date, category).pipe(
      catchError(e => {
        console.log("error from server", e);
        return of([]);
      }),
    );
  }),
);

function makePopup(crime, title) {
  let html = `
    <h2>${title}</h2>
    <p>${crime.location.street.name}</p>`;

  const o = crime.outcome_status;
  if (o) {
    html += `
      <p>
        <b>${capitalize(
          new Date(o.date).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          }),
        )}: </b>
        <span>${o.category}</span>
      </p>`;
  }
  return new mapboxgl.Popup().setHTML(html);
}

function categoryUrlToName(list, url) {
  const entry = list.find(v => v.url == url);
  return entry ? entry.name : url;
}

let prev = [];

crime$
  .pipe(withLatestFrom(categoriesList$, repaint$))
  .subscribe(([crimeData, cats, mapElem]) => {
    console.log(crimeData);
    prev.forEach(m => m.remove());

    prev = cropData(100, crimeData).map(crime => {
      const loc = crime.location;
      const lnglat = mapboxgl.LngLat.convert(
        [loc.longitude, loc.latitude].map(parseFloat),
      );
      const marker = new mapboxgl.Marker()
        .setLngLat(lnglat)
        .setPopup(makePopup(crime, categoryUrlToName(cats, crime.category)));

      return marker;
    });

    prev.forEach(m => m.addTo(mapElem));
  });
