import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="page-bg min-h-screen">
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <h1 className="font-serif text-3xl">Page introuvable</h1>
      <p className="text-muted mt-2">La page demandée n’existe pas.</p>
      <Link to="/" className="mt-4 inline-block text-brand">← Retour à l’accueil</Link>
    </div>
    </div>
  )
}
