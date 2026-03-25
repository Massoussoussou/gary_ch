import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import CalendarPicker from "./CalendarPicker";
import { useLocale } from "../../hooks/useLocale.js";
import {
  IconCheck,
  IconChart,
  IconHome,
  IconTarget,
  IconCalendar,
  IconPhone,
  IconBook,
} from "./icons";

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

export default function ConfirmationPage({ firstName, onOpenEbook }) {
  const { t, link } = useLocale();
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("gary@gary.ch").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, []);

  return (
    <section className="conf">
      <div className="conf-wrap">

        {/* ===== LEFT COLUMN ===== */}
        <div className="conf-left">

          {/* Header */}
          <div className="conf-header">
            <p className="conf-eyebrow">{t("estimate.confirm.eyebrow")}</p>
            <h1 className="conf-title">
              {t("estimate.confirm.thanks")}{firstName ? `, ${firstName}` : ""}<span>.</span>
            </h1>
            <p className="conf-desc">
              {t("estimate.confirm.desc")}
            </p>
          </div>

          {/* What you'll get */}
          <div className="conf-expect">
            <h3 className="conf-label">{t("estimate.confirm.expect_label")}</h3>
            <div className="conf-expect-list">
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconChart /></span>
                <div>
                  <strong>{t("estimate.confirm.expect1_title")}</strong>
                  <p>{t("estimate.confirm.expect1_desc")}</p>
                </div>
              </div>
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconHome /></span>
                <div>
                  <strong>{t("estimate.confirm.expect2_title")}</strong>
                  <p>{t("estimate.confirm.expect2_desc")}</p>
                </div>
              </div>
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconTarget /></span>
                <div>
                  <strong>{t("estimate.confirm.expect3_title")}</strong>
                  <p>{t("estimate.confirm.expect3_desc")}</p>
                </div>
              </div>
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconCalendar size={18} color="#FF4A3E" /></span>
                <div>
                  <strong>{t("estimate.confirm.expect4_title")}</strong>
                  <p>{t("estimate.confirm.expect4_desc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary links */}
          <div className="conf-links">
            <h3 className="conf-label">{t("estimate.confirm.meanwhile")}</h3>
            <Link to={link("buy")} className="conf-link-item">
              <span className="conf-link-ico"><IconHome /></span>
              {t("cta.discover_properties")}
            </Link>
            <button type="button" className="conf-link-item" onClick={onOpenEbook}>
              <span className="conf-link-ico"><IconBook /></span>
              {t("estimate.confirm.get_guide")}
            </button>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="conf-right">

          {/* Calendar */}
          <div className="conf-calendar">
            <h2 className="conf-calendar-title">{t("estimate.confirm.book_slot")}</h2>
            <p className="conf-calendar-sub">
              {t("estimate.confirm.book_slot_sub")}
            </p>
            <CalendarPicker />
          </div>

          {/* Contact */}
          <div className="conf-contact-bar">
            <p className="conf-contact-text">
              <IconPhone size={14} color="#FF4A3E" />
              {t("estimate.confirm.question")}
            </p>
            <div className="conf-contact-actions">
              <a
                href="tel:+41225570700"
                className="conf-contact-btn"
                onClick={() => pushGTM("phone_click")}
              >
                +41 22 557 07 00
              </a>
              <button
                type="button"
                className={`conf-contact-btn${copied ? " copied" : ""}`}
                onClick={copyEmail}
              >
                {copied ? t("estimate.confirm.copied") : "gary@gary.ch"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
