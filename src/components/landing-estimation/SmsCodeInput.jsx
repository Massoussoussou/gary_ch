import React, { useRef, useEffect } from "react";
import { useLocale } from "../../hooks/useLocale.js";

export default function SmsCodeInput({
  visible,
  onComplete,
  error,
  status,
  countdown,
  onResend,
}) {
  const inputsRef = useRef([]);

  useEffect(() => {
    if (visible && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [visible]);

  // Reset inputs when status changes to failed
  useEffect(() => {
    if (status === "failed") {
      inputsRef.current.forEach((el) => {
        if (el) {
          el.value = "";
          el.classList.add("wrong");
        }
      });
      setTimeout(() => {
        inputsRef.current.forEach((el) => {
          if (el) el.classList.remove("wrong");
        });
        if (inputsRef.current[0]) inputsRef.current[0].focus();
      }, 400);
    }
  }, [status]);

  // Mark correct when verified
  useEffect(() => {
    if (status === "verified") {
      inputsRef.current.forEach((el) => {
        if (el) {
          el.classList.add("correct");
          el.readOnly = true;
        }
      });
    }
  }, [status]);

  const handleInput = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = val;
    if (val.length === 1 && idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    }
    // Check if all 4 filled
    if (idx === 3 && val.length === 1) {
      const code = inputsRef.current.map((el) => el?.value || "").join("");
      if (code.length === 4) onComplete(code);
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !e.target.value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    for (let j = 0; j < paste.length; j++) {
      if (inputsRef.current[j]) inputsRef.current[j].value = paste[j];
    }
    if (paste.length === 4) onComplete(paste);
  };

  const { t } = useLocale();

  if (!visible) return null;

  return (
    <div className={`sms-code-section${visible ? " show" : ""}`}>
      <label className="sms-code-label">{t("estimate.sms.label")}</label>
      <div className="sms-code-row">
        {[0, 1, 2, 3].map((idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            className="sms-code-input"
            maxLength={1}
            inputMode="numeric"
            autoComplete={idx === 0 ? "one-time-code" : "off"}
            onInput={(e) => handleInput(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            readOnly={status === "verified"}
            aria-label={t("estimate.sms.digit_aria", { num: idx + 1 })}
          />
        ))}
      </div>
      <div className="sms-code-footer">
        <span className="sms-code-error">{error}</span>
        <button
          type="button"
          className="sms-resend"
          disabled={countdown > 0}
          onClick={onResend}
        >
          {countdown > 0 ? t("estimate.sms.resend_countdown", { seconds: countdown }) : t("estimate.sms.resend")}
        </button>
      </div>
    </div>
  );
}
