export default function SortMenu({value, onChange}){
  return (
    <div className="max-w-6xl mx-auto px-4 mt-3 flex justify-end">
      <select value={value} onChange={e=>onChange(e.target.value)} className="border border-line rounded-lg px-3 py-2 bg-white">
        <option value="recent">Plus récentes</option>
        <option value="prix-asc">Prix ↑</option>
        <option value="prix-desc">Prix ↓</option>
        <option value="surface">Surface</option>
      </select>
    </div>
  )
}
