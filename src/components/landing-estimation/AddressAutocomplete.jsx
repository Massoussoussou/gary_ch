import React, { useState, useRef, useEffect } from "react";
import useAddressAutocomplete from "../../hooks/useAddressAutocomplete";

export default function AddressAutocomplete({ value, onChange, onSelect }) {
  const { results, search, clear, extractAddress } = useAddressAutocomplete();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        clear();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [clear]);

  const handleInput = (e) => {
    const v = e.target.value;
    onChange(v);
    search(v);
    setOpen(true);
  };

  const handleSelect = (item) => {
    const addr = extractAddress(item);
    onChange(addr.street);
    onSelect(addr);
    setOpen(false);
    clear();
  };

  return (
    <div className="form-group" ref={wrapRef} style={{ position: "relative" }}>
      <label htmlFor="addressAutocomplete">Adresse du bien</label>
      <input
        type="text"
        id="addressAutocomplete"
        placeholder="Commencez à taper l'adresse..."
        value={value}
        onChange={handleInput}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <div className="address-dropdown open">
          {results.map((item) => (
            <div
              key={item.place_id}
              className="address-dropdown-item"
              onClick={() => handleSelect(item)}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
