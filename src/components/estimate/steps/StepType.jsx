// src/components/estimate/steps/StepType.jsx
import { Home, Building2 } from "lucide-react";
import BubbleOption from "../BubbleOption.jsx";

export default function StepType({ value, onChange }) {
  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">Quel est votre type de bien ?</h3>
      <p className="text-black/60 mt-1">Choisissez une catégorie.</p>

      <div className="flex flex-wrap justify-center gap-10 mt-8">
        <BubbleOption
          icon={Home}
          label="Maison"
          active={value === "maison"}
          onClick={() => onChange("maison")}
        />
        <BubbleOption
          icon={Building2}
          label="Appartement"
          active={value === "appartement"}
          onClick={() => onChange("appartement")}
        />
      </div>
    </div>
  );
}
