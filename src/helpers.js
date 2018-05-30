export function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function cropData(take, arr) {
  const every = Math.trunc(arr.length / take);
  const res = [];
  for (let i = 0; i < take * every; i += every) {
    res.push(arr[i]);
  }
  return res;
}
