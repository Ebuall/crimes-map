import * as React from "react";
import { render } from "react-dom";
import DatePicker from "react-date-picker";
import { BehaviorSubject } from "rxjs";
import { last } from "rxjs/operators";

class DateWrapper extends React.Component {
  state = { date: getLastMonth() };

  onChange = input => {
    const date = input || getLastMonth();

    // fix date being wrong month due to timezone
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    console.debug({ date, input });
    this.setState({ date });
    this.props.onChange(date);
  };

  render() {
    return (
      <DatePicker
        maxDate={getLastMonth()}
        maxDetail="year"
        minDetail="decade"
        onChange={this.onChange}
        value={this.state.date}
      />
    );
  }
}

export function initDatePicker() {
  const selectDate$ = new BehaviorSubject(getLastMonth());
  const onChange = v => selectDate$.next(v);

  render(
    <DateWrapper onChange={onChange} />,
    document.getElementById("datepicker"),
  );

  return { selectDate$ };
}

function getLastMonth() {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return lastMonth;
}
