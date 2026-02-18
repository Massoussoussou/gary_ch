import React from "react";

const portals = ["Homegate", "ImmoScout24", "Immobilier.ch", "Acheter-Louer", "Realforce"];

export default function PortalsSection() {
  return (
    <section className="portals">
      <div className="portals-inner">
        <div className="portals-label">
          Votre bien diffusé sur les meilleurs portails
        </div>
        <div className="portal-logos">
          {portals.map((name) => (
            <div className="portal-logo" key={name}>{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
