export default function SpecsGrid({pieces, surface, terrain, etat, style}){
  const item = (label, value) => (
    <div className="rounded-lg border border-line/70 bg-white px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="font-medium">{value ?? '—'}</div>
    </div>
  )
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {item('Pièces', pieces)}
      {item('Surface', surface ? surface + ' m²' : '—')}
      {item('Surface du terrain', terrain ? terrain + ' m²' : '—')}
      {item('État', etat)}
      {item('Style', style)}
    </div>
  )
}
