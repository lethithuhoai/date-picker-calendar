import React, { useEffect, useState } from "react";
import "../Calendar/style.css";

export const MainCalendar = () => {
  const week = [
    { id: 1, day: "Sun" },
    { id: 2, day: "Tue" },
    { id: 3, day: "Wed" },
    { id: 4, day: "Thu" },
    { id: 5, day: "Fri" },
    { id: 6, day: "Sat" },
    { id: 7, day: "Mon" },
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // choose day

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();
  let [month, setMonth] = useState(currentMonth);
  let [year, setYear] = useState(currentYear);

  const [data, setData] = useState([]);
  const [chosen, setChosen] = useState({ firstDay: null, secondDay: null });

  const getCurrentYear = new Date().getFullYear();
  const lastOfYear = Array.from({ length: 30 }, (_, i) => getCurrentYear - i);
  const futureOfYear = Array.from(
    { length: 30 },
    (_, i) => getCurrentYear + 1 + i
  );
  const listOfYears = lastOfYear.reverse().concat(futureOfYear);

  useEffect(() => {
    handleGetDays();
  }, [month, chosen]);

  const handleGetDays = () => {
    const arrayActiveDay = [];
    const getMonths = new Date().getMonth();
    const getYears = new Date().getFullYear();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const firstDateOfMonth = new Date(getYears, getMonths, 1).getDay();
    const lastDateOfLastMonth = new Date(
      currentYear,
      currentMonth,
      0
    ).getDate();

    //Handle for day active
    for (let i = firstDateOfMonth; i > 0; i--) {
      arrayActiveDay.push({
        value: lastDateOfLastMonth - i + 1,
        type: "unActive",
        priority: 1,
      });
    }

    //Handle for day unActive above
    for (let i = 1; i <= lastDateOfMonth; i++) {
      arrayActiveDay.push({ value: i, type: "active", priorityDisplay: 2 });
    }

    arrayActiveDay.forEach((e) => {
      if (e?.value === chosen?.firstDay?.value) {
        e.isChosen = chosen.firstDay?.isChosen;
      }

      if (e?.value === chosen?.secondDay?.value) {
        e.isChosen = chosen.secondDay?.isChosen;
      }

      if (
        chosen?.firstDay?.value &&
        chosen?.secondDay?.value &&
        e?.value < chosen?.secondDay?.value &&
        e?.value > chosen?.firstDay?.value
      ) {
        e.isPaint = true;
      }
    });

    setData(arrayActiveDay);
  };

  // select month
  const handleSelectMonth = (selectedMonth) => {
    const findMonth = months.indexOf(selectedMonth);
    setMonth(findMonth);
  };
  // select year
  const handleSelectYear = (selectYear) => {
    const findYear = listOfYears.find((year) => {
      return Number(selectYear) === year;
    });
    setYear(findYear);
  };

  const handleChooseDay = (e) => {
    if (
      chosen?.firstDay &&
      chosen.secondDay &&
      chosen?.firstDay?.value > e?.value
    ) {
      setChosen({ ...chosen, firstDay: { ...e, isChosen: true } });
      return;
    }

    if (
      chosen?.firstDay &&
      chosen.secondDay &&
      chosen?.firstDay?.value < e?.value
    ) {
      setChosen({ ...chosen, secondDay: { ...e, isChosen: true } });
      return;
    }

    if (chosen?.firstDay && !chosen.secondDay) {
      setChosen({ ...chosen, secondDay: { ...e, isChosen: true } });
      return;
    }

    if (!chosen?.firstDay && chosen.secondDay) {
      setChosen({ ...chosen, firstDay: { ...e, isChosen: true } });
      return;
    }

    setChosen({ ...chosen, firstDay: { ...e, isChosen: true } });
  };

  console.log(data);
  // click date
  return (
    <div className="calendar">
      <input
        type="text"
        className="inputCalendar"
        value={`${chosen.firstDay ? chosen?.firstDay?.value : currentDay}/${
          month + 1
        }/${currentYear} - ${
          chosen.secondDay ? chosen?.secondDay?.value : currentDay
        }/${month + 1}/${currentYear}`}
        style={{ textAlign: "center" }}
      />

      <div>
        <select
          id="months"
          defaultValue={months[month]}
          onChange={(e) => handleSelectMonth(e.target.value)}
        >
          <option>Select month</option>
          {months.map((month) => {
            return (
              <option key={month} value={month}>
                {month}
              </option>
            );
          })}
        </select>

        <select
          id="years"
          defaultValue={listOfYears.find((e) => e === year)}
          onChange={(e) => handleSelectYear(e.target.value)}
        >
          <option>Select year</option>
          {listOfYears.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mainCalendar">
        <ul className="week">
          {week.map((item) => (
            <li key={item.id}>{item.day}</li>
          ))}
        </ul>

        <ul className="active-days">
          {data.map((day, index) => (
            <li
              className={
                day?.priority === 1 || day?.priority === 3
                  ? "unactive-days"
                  : ""
              }
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => handleChooseDay(day)}
            >
              <div className={day?.isChosen ? "chosen" : ""}>
                <div className={day?.isPaint ? "paint" : ""}>
                  {day?.value || ""}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
