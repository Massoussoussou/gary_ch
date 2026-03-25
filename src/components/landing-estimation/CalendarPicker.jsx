import React, { useState, useMemo } from "react";
import { useLocale } from "../../hooks/useLocale.js";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00",
];

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

export default function CalendarPicker() {
  const { t } = useLocale();
  const MONTHS = t("estimate.calendar.months", { returnObjects: true });
  const DAYS = t("estimate.calendar.days_short", { returnObjects: true });
  const DAYS_LONG = t("estimate.calendar.days_long", { returnObjects: true });

  const formatDate = (date) =>
    `${DAYS_LONG[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()].toLowerCase()}`;

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
        <div className="cal-confirmed-title">{t("estimate.calendar.slot_booked")}</div>
        <div className="cal-confirmed-detail">
          {formatDate(selectedDate)} {t("estimate.calendar.at")} {selectedTime}
        </div>
        <p className="cal-confirmed-note">
          {t("estimate.calendar.sms_confirmation")}<br />
          {t("estimate.calendar.call_us")} <a href="tel:+41225570700">+41 22 557 07 00</a>.
        </p>
        <button
          type="button"
          className="cal-change-btn"
          onClick={() => setConfirmed(false)}
        >
          {t("estimate.calendar.change_slot")}
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
          aria-label={t("estimate.calendar.prev_month")}
        >
          &#8249;
        </button>
        <span className="cal-nav-label">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="cal-nav-arrow"
          onClick={goNext}
          aria-label={t("estimate.calendar.next_month")}
        >
          &#8250;
        </button>
      </div>

      {/* Day grid */}
      <div className="cal-grid">
        {DAYS.map((d) => (
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
              aria-label={day ? `${day} ${MONTHS[viewMonth]}` : undefined}
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
            {t("estimate.calendar.available_slots")} &mdash; {formatDate(selectedDate)}
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
          {t("estimate.calendar.confirm")} &mdash; {formatDate(selectedDate)} {t("estimate.calendar.at")} {selectedTime}
        </button>
      )}
    </div>
  );
}
