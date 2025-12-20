import { useState } from 'react'

export default function Gallery({images=[]}){
  const [idx, setIdx] = useState(0)
  const main = images[idx] || 'https://picsum.photos/seed/placeholder/1600/900'
  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-line/70 aspect-video">
        <img src={main} alt="" className="w-full h-full object-cover"/>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.slice(0,5).map((src,i)=>(
          <button key={i} className={`rounded-lg overflow-hidden border ${i===idx?'border-primary':'border-line/70'}`} onClick={()=>setIdx(i)}>
            <img src={src} alt="" className="w-full h-full object-cover aspect-video"/>
          </button>
        ))}
      </div>
    </div>
  )
}
