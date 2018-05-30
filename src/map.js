import { fromEvent, merge } from "rxjs";
import {
  map,
  debounceTime,
  shareReplay,
  switchMapTo,
  startWith,
  tap,
} from "rxjs/operators";

import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWJ1YWxsIiwiYSI6ImNqaHE4dzdrZjFxZzUzZHMzcmpjcnM1bzQifQ.rOh2pUaE5UkMgNCsqtdfFw";

export function initMap() {
  const mapElem = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v10?optimize=true",
    center: [-0.1285, 51.52],
    zoom: 16,
  });

  const repaint$ = fromEvent(mapElem, "load").pipe(
    tap(() => {
      console.debug("loaded");
      window.dispatchEvent(new Event("resize"));
    }),
    switchMapTo(startWith(void 0)(fromEvent(mapElem, "render"))),
    debounceTime(400),
    // tap(() => console.debug("rendered")),
    map(_ev => mapElem),
    shareReplay(1),
  );

  return { repaint$ };
}
