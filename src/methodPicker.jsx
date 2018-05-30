import { empty, BehaviorSubject } from "rxjs";
import * as React from "react";
import { render } from "react-dom";
import * as api from "./api";

class MethodPicker extends React.Component {
  render() {
    return (
      <label className="category-label">
        Method:
        <select className="category-select" onChange={this.props.onChange}>
          {this.props.list.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
    );
  }
}

export function initMethodPicker() {
  const list = ["streetLevel", "streetLevelPoint"];
  const selectMethod$ = new BehaviorSubject(list[0]);
  const onChange = v => selectMethod$.next(v.target.value);
  const root = document.getElementById("method");

  render(<MethodPicker list={list} onChange={onChange} />, root);

  return { selectMethod$ };
}
