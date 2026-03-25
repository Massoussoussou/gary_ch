import React from "react";
import SmsCodeInput from "./SmsCodeInput";
import { IconCheck, IconLock } from "./icons";
import { useLocale } from "../../hooks/useLocale.js";

export default function FormStep3({
  data,
  onChange,
  onSubmit,
  submitting,
  stepState,
  sms,
}) {
  const { t } = useLocale();
  const update = (field, value) => onChange({ ...data, [field]: value });

  const handleSendCode = () => {
    const phone = data.phone.trim().replace(/\s/g, "");
    if (phone.length < 10) return;
    sms.sendCode(data.phone.trim());
  };

  const handleVerifyCode = (code) => {
    sms.verifyCode(data.phone.trim(), code);
  };

  const verifyBtnText = () => {
    if (sms.status === "sending") return "...";
    if (sms.status === "codeSent" || sms.status === "failed") return t("estimate.form3.sent");
    return t("estimate.form3.verify");
  };

  const verifyBtnClass = () => {
    let cls = "phone-verify-btn";
    if (sms.status === "sending") cls += " loading";
    if (sms.status === "codeSent" || sms.status === "failed") cls += " sent";
    return cls;
  };

  return (
    <div className={`form-step ${stepState}`}>
      <div className="form-step-header">
        <div className={`form-step-num ${stepState === "expanded" ? "active" : "pending"}`}>
          3
        </div>
        <span className={`form-step-label ${stepState === "expanded" ? "active" : "pending"}`}>
          {t("estimate.form3.step_label")}
        </span>
        <div className="form-step-line" />
      </div>

      <div className="form-row">
        <div className={`form-group${!data.lastName && data._touched?.lastName ? " has-error" : ""}`}>
          <label htmlFor="fieldNom">{t("form.lastname")}</label>
          <input
            type="text"
            id="fieldNom"
            placeholder={t("form.placeholder_lastname")}
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            onBlur={() => update("_touched", { ...data._touched, lastName: true })}
          />
        </div>
        <div className={`form-group${!data.firstName && data._touched?.firstName ? " has-error" : ""}`}>
          <label htmlFor="fieldPrenom">{t("form.firstname")}</label>
          <input
            type="text"
            id="fieldPrenom"
            placeholder={t("form.placeholder_firstname")}
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            onBlur={() => update("_touched", { ...data._touched, firstName: true })}
          />
        </div>
      </div>

      <div className={`form-group${!data.phone && data._touched?.phone ? " has-error" : ""}`}>
        <label htmlFor="fieldPhone">{t("form.phone")}</label>
        {sms.status !== "verified" ? (
          <div className="phone-verify-row">
            <input
              type="tel"
              id="fieldPhone"
              placeholder="+41 79 000 00 00"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              readOnly={sms.status === "codeSent" || sms.status === "failed"}
              style={sms.status === "codeSent" || sms.status === "failed" ? { opacity: 0.5 } : undefined}
            />
            <button
              type="button"
              className={verifyBtnClass()}
              onClick={handleSendCode}
              disabled={sms.status === "sending"}
            >
              {verifyBtnText()}
            </button>
          </div>
        ) : (
          <>
            <input
              type="tel"
              id="fieldPhone"
              value={data.phone}
              readOnly
              style={{ opacity: 0.5 }}
            />
            <div className="phone-verified show">
              <IconCheck size={14} color="#2d8a4e" /> {t("estimate.form3.phone_verified")}
            </div>
          </>
        )}
      </div>

      <SmsCodeInput
        visible={sms.status === "codeSent" || sms.status === "failed"}
        onComplete={handleVerifyCode}
        error={sms.error}
        status={sms.status}
        countdown={sms.countdown}
        onResend={handleSendCode}
      />

      <div className="form-group">
        <label htmlFor="fieldEmail">
          {t("form.email")} <span className="form-optional">{t("form.optional")}</span>
        </label>
        <input
          type="email"
          id="fieldEmail"
          placeholder="votre@email.ch"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <button
        type="button"
        className="form-submit"
        onClick={onSubmit}
        disabled={submitting}
      >
        {submitting ? t("estimate.form3.submitting") : t("estimate.form3.submit")}
      </button>

      <div className="form-trust">
        <IconLock /> {t("estimate.form3.trust")}
      </div>
      <div className="form-note">
        {t("estimate.form3.note")}
      </div>
    </div>
  );
}
