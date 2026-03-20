import React, { useState, useMemo } from "react";

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00",
];

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

const formatDateFr = (date) => {
  const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  return `${days[date.getDay()]} ${date.getDate()} ${MONTHS_FR[date.getMonth()].toLowerCase()}`;
};

export default function CalendarPicker() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const result = [];
    for (let i = 0; i < startDay; i++) result.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) result.push(d);
    return result;
  }, [viewMonth, viewYear]);

  const isWeekend = (day) => {
    if (!day) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const isPast = (day) => {
    if (!day) return false;
    const d = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayStart;
  };

  const canGoPrev = viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const goNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const goPrev = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const handleDayClick = (day) => {
    if (!day || isWeekend(day) || isPast(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setSelectedTime(null);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    pushGTM("calendar_booking", {
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
    });
  };

  const isSelectedDay = (day) =>
    selectedDate &&
    day === selectedDate.getDate() &&
    viewMonth === selectedDate.getMonth() &&
    viewYear === selectedDate.getFullYear();

  // ---- Confirmed state ----
  if (confirmed && selectedDate && selectedTime) {
    return (
      <div className="cal-confirmed">
        <div className="cal-confirmed-icon">&#10003;</div>
        <div className="cal-confirmed-title">Créneau réservé</div>
        <div className="cal-confirmed-detail">
          {formatDateFr(selectedDate)} à {selectedTime}
        </div>
        <p className="cal-confirmed-note">
          Nous vous enverrons une confirmation par SMS.<br />
          Vous pouvez aussi nous joindre au <a href="tel:+41225570700">+41 22 557 07 00</a>.
        </p>
        <button
          type="button"
          className="cal-change-btn"
          onClick={() => setConfirmed(false)}
        >
          Modifier le créneau
        </button>
      </div>
    );
  }

  // ---- Calendar picker ----
  return (
    <div className="cal-picker">
      {/* Month navigation */}
      <div className="cal-nav">
        <button
          type="button"
          className="cal-nav-arrow"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Mois précédent"
        >
          &#8249;
        </button>
        <span className="cal-nav-label">
          {MONTHS_FR[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="cal-nav-arrow"
          onClick={goNext}
          aria-label="Mois suivant"
        >
          &#8250;
        </button>
      </div>

      {/* Day grid */}
      <div className="cal-grid">
        {DAYS_FR.map((d) => (
          <div className="cal-head" key={d}>{d}</div>
        ))}
        {days.map((day, i) => {
          const disabled = !day || isWeekend(day) || isPast(day);
          return (
            <button
              key={i}
              type="button"
              className={
                "cal-cell" +
                (disabled ? " disabled" : "") +
                (isSelectedDay(day) ? " selected" : "") +
                (!day ? " empty" : "")
              }
              onClick={() => handleDayClick(day)}
              disabled={disabled}
              aria-label={day ? `${day} ${MONTHS_FR[viewMonth]}` : undefined}
            >
              {day || ""}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="cal-times">
          <div className="cal-times-label">
            Créneaux disponibles &mdash; {formatDateFr(selectedDate)}
          </div>
          <div className="cal-times-grid">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                className={"cal-slot" + (selectedTime === t ? " selected" : "")}
                onClick={() => { setSelectedTime(t); setConfirmed(false); }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm button */}
      {selectedDate && selectedTime && (
        <button type="button" className="cal-book-btn" onClick={handleConfirm}>
          Confirmer &mdash; {formatDateFr(selectedDate)} à {selectedTime}
        </button>
      )}
    </div>
  );
}
