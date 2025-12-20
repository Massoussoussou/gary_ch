import { useEffect, useState } from "react";

const PASSWORD = "gary2025"; // change le mot de passe ici

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ok = localStorage.getItem("gary_authed") === "true";
    if (ok) setAuthed(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuthed(true);
      localStorage.setItem("gary_authed", "true");
    } else {
      alert("Mot de passe incorrect");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4 min-w-[280px]"
        >
          <h1 className="text-xl font-semibold text-center">
            Accès privé – Site Gary
          </h1>
          <input
            type="password"
            placeholder="Mot de passe"
            className="border px-3 py-2 rounded-md outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 py-2 rounded-md border border-black font-medium"
          >
            Entrer
          </button>
        </form>
      </div>
    );
  }

  return children;
}
