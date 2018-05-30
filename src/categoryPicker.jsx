import { empty, BehaviorSubject } from "rxjs";
import * as React from "react";
import { render } from "react-dom";
import * as api from "./api";

class CategoryPicker extends React.Component {
  render() {
    return (
      <label className="category-label">
        {/* Crime category: */}
        <select className="category-select" onChange={this.props.onChange}>
          {this.props.list.map(({ url, name }) => (
            <option key={url} value={url}>
              {name}
            </option>
          ))}
        </select>
      </label>
    );
  }
}

export function initCategoryPicker(list$) {
  const selectCategory$ = new BehaviorSubject(
    api.getDefaultCategories()[0].url,
  );
  const onChange = v => selectCategory$.next(v.target.value);
  const root = document.getElementById("category");

  list$.subscribe(list =>
    render(<CategoryPicker list={list} onChange={onChange} />, root),
  );

  return { selectCategory$ };
}
