const ART_LABELS = {
  headphones: 'Sketch of headphones surrounding a rainy window',
  vinyl: 'Sketch of a record player and floating musical notes',
  movement: 'Sketch of a person stretching beside a chair',
  bicycle: 'Sketch of a bicycle and a winding movement line',
  phone: 'Exploded sketch of a repairable modular phone',
  robot: 'Sketch of a small robot sorting useful and discarded signals',
  city: 'Sketch of a rooftop garden above a city block',
  microphone: 'Sketch of a reporter microphone with fact-check notes',
  map: 'Sketch of a folded map with an accessible travel route',
  train: 'Sketch of a train passing mountains and a station clock',
  controller: 'Sketch of a game controller growing leaves',
  spaceship: 'Sketch of a tiny spaceship orbiting a pixel planet',
}

function ArtworkScene({ type }) {
  switch (type) {
    case 'headphones':
      return <>
        <path d="M112 116c0-52 35-86 88-86s88 34 88 86" />
        <path d="M110 112c-18 2-28 18-25 43l5 38c3 21 20 29 38 22l20-8-13-91-25-4Z" />
        <path d="M290 112c18 2 28 18 25 43l-5 38c-3 21-20 29-38 22l-20-8 13-91 25-4Z" />
        <path d="M149 87h102M151 101h98" className="art-faint" />
        <path d="M174 132l15 12 20-29 18 23 24-19" className="art-accent" />
        <path d="M61 41l9 14 14 3-13 8-3 14-8-13-14-4 13-8Z" className="art-accent art-fill" />
        <path d="M335 62c-10 17-12 24-5 30 7 5 17-2 17-12 0-8-5-13-12-18ZM55 126c-10 17-12 24-5 30 7 5 17-2 17-12 0-8-5-13-12-18Z" className="art-faint" />
      </>
    case 'vinyl':
      return <>
        <path d="M78 59h240v157H78z" />
        <circle cx="171" cy="137" r="65" /><circle cx="171" cy="137" r="39" className="art-faint" />
        <circle cx="171" cy="137" r="11" className="art-accent art-fill" />
        <path d="M270 89v77c0 24-19 43-42 43" /><circle cx="270" cy="85" r="8" className="art-accent art-fill" />
        <path d="M93 77h44M283 190h20M281 177h24" className="art-faint" />
        <path d="M330 68c20-12 31-4 30 14-1 12-10 21-24 26M350 62v42M48 104c14-10 25-3 23 10-1 10-9 16-19 18M68 99v30" className="art-accent" />
      </>
    case 'movement':
      return <>
        <circle cx="203" cy="55" r="25" />
        <path d="M189 83c-18 27-25 62-19 98M218 82c17 22 30 46 49 61M178 108c-33 14-52 34-70 63M171 180l-45 45M171 180l60 42" />
        <path d="M72 151h72v62H72zM82 213v24M134 213v24" className="art-faint" />
        <path d="M275 53c34 17 49 44 49 79M318 120l7 14 10-13" className="art-accent" />
        <path d="M49 62c19-15 38-19 58-12" className="art-faint" />
      </>
    case 'bicycle':
      return <>
        <circle cx="111" cy="176" r="55" /><circle cx="289" cy="176" r="55" />
        <path d="M111 176l60-86 43 86H111l46-63h85l47 63M157 89h39M239 84l12 22h29" />
        <circle cx="214" cy="176" r="9" className="art-accent art-fill" />
        <path d="M48 70c51-26 104-31 159-15M47 85c31-14 55-18 82-16" className="art-faint" />
        <path d="M311 63c16-13 30-12 40 4-18 3-28 12-31 27-14-6-17-16-9-31Z" className="art-accent" />
      </>
    case 'phone':
      return <>
        <rect x="147" y="36" width="107" height="200" rx="13" />
        <rect x="163" y="61" width="75" height="118" rx="3" className="art-faint" />
        <path d="M174 198h53M200 47h17" />
        <path d="M89 73h38v61H89zM276 80h40v48h-40zM277 151h48v57h-48z" className="art-accent" />
        <path d="M127 102h20M254 101h22M254 180h23M99 144v38h46" className="art-faint" />
        <path d="M71 54l8 12 14 2-11 9 2 14-12-7-13 7 4-14-10-9 14-2Z" className="art-accent art-fill" />
      </>
    case 'robot':
      return <>
        <rect x="126" y="78" width="149" height="128" rx="24" />
        <path d="M169 78V55h61v23M200 55V34" /><circle cx="200" cy="28" r="7" className="art-accent art-fill" />
        <circle cx="168" cy="123" r="11" /><circle cx="235" cy="123" r="11" />
        <path d="M166 168c19 15 49 16 70 0M126 116H96l-25 39M275 116h29l27 37M158 206v28M243 206v28" />
        <path d="M58 181h65M278 181h65M58 191h47M295 191h48" className="art-faint" />
        <path d="M83 142l12 8-8 14M315 141l-12 9 8 14" className="art-accent" />
      </>
    case 'city':
      return <>
        <path d="M47 218h307M72 218V105h81v113M153 218V66h100v152M253 218V123h75v95" />
        <path d="M91 128h20M91 154h20M91 181h20M176 91h23M176 119h23M217 91h15M217 119h15M274 148h20M274 176h20" className="art-faint" />
        <path d="M135 66h136M151 65c8-28 30-30 39 0M198 64c9-39 38-39 45 0M242 65c1-24 21-30 29 0" className="art-accent" />
        <path d="M167 63c-10-18-6-29 12-34 5 17 1 28-12 34ZM225 61c8-21 21-27 36-15-9 17-21 22-36 15Z" className="art-accent" />
      </>
    case 'microphone':
      return <>
        <path d="M136 58c0-25 20-43 45-43s45 18 45 43v61c0 26-20 45-45 45s-45-19-45-45Z" />
        <path d="M116 111v11c0 37 29 66 65 66s65-29 65-66v-11M181 188v41M147 230h69" />
        <path d="M150 72h62M150 91h62M150 110h62" className="art-faint" />
        <path d="M275 54h72v105h-72zM290 79h40M290 101h32M290 123h37" />
        <path d="M283 145l11 10 20-24" className="art-accent" />
        <path d="M53 75h46M53 91h63M53 107h38" className="art-faint" />
      </>
    case 'map':
      return <>
        <path d="M64 63l86-26 101 29 85-28v168l-85 29-101-29-86 27Z" />
        <path d="M150 38v168M251 66v169" className="art-faint" />
        <path d="M91 173c40-71 82 3 113-58 24-48 61-38 91-5" className="art-accent" />
        <path d="M291 96c-17 0-30 13-30 30 0 24 30 52 30 52s30-28 30-52c0-17-13-30-30-30Z" />
        <circle cx="291" cy="126" r="9" className="art-accent art-fill" />
        <path d="M74 91l33-10M166 70l55 16M168 181l47-18" className="art-faint" />
      </>
    case 'train':
      return <>
        <path d="M73 182h256M91 180V76c0-22 17-38 39-38h143c22 0 38 16 38 38v104" />
        <path d="M111 74h180v63H111zM199 74v63M116 160h170" />
        <circle cx="134" cy="183" r="22" /><circle cx="267" cy="183" r="22" />
        <path d="M57 220h286M104 220l30-37M296 220l-29-37" className="art-faint" />
        <path d="M55 104l42-46M52 127l67-72M307 57c30 6 48 25 52 55" className="art-accent" />
      </>
    case 'controller':
      return <>
        <path d="M107 105c16-26 42-39 73-31l20 6 20-6c31-8 57 5 73 31 20 34 39 94 17 112-17 14-41-2-58-28l-12-17h-80l-12 17c-17 26-41 42-58 28-22-18-3-78 17-112Z" />
        <path d="M135 119v47M111 142h48" /><circle cx="256" cy="128" r="10" /><circle cx="279" cy="151" r="10" className="art-accent art-fill" />
        <path d="M183 113h34" className="art-faint" />
        <path d="M90 75c-9-28 3-46 31-53-2 26-11 43-31 53ZM310 91c2-28 16-42 44-42-8 25-22 39-44 42Z" className="art-accent" />
        <path d="M73 74c22 5 34 18 38 39M329 84c-18 9-28 23-29 42" className="art-accent" />
      </>
    case 'spaceship':
      return <>
        <path d="M177 62c28-38 59-47 91-42 5 32-4 63-42 91l-49 36-36-36Z" />
        <circle cx="225" cy="67" r="19" className="art-accent" />
        <path d="M176 101l-45 2-31 37 61 5M214 138l-3 45-37 31-5-61" />
        <path d="M135 151l-49 49M151 168l-35 52M116 134l-50 35" className="art-accent" />
        <circle cx="305" cy="169" r="57" />
        <path d="M253 153c24-9 47-8 69 4M265 195c28 14 53 12 77-7" className="art-faint" />
        <path d="M316 73l6 11 13 2-9 9 2 13-12-6-11 6 2-13-9-9 13-2Z" className="art-accent art-fill" />
      </>
    default:
      return null
  }
}

export default function PostArtwork({ type, topic }) {
  const patternId = `paper-dots-${type}`
  return (
    <svg
      className="post-artwork"
      viewBox="0 0 400 260"
      role="img"
      aria-label={ART_LABELS[type] || `Pencil illustration for ${topic}`}
    >
      <defs>
        <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="0.75" className="art-dot" />
        </pattern>
      </defs>
      <rect width="400" height="260" className="art-paper" />
      <rect width="400" height="260" fill={`url(#${patternId})`} />
      <path d="M18 231c74-13 133-6 197-1 60 5 108 1 171-10" className="art-ground" />
      <g className="art-lines"><ArtworkScene type={type} /></g>
      <path d="M24 28c34-10 63-9 91-5M286 235c33-4 59-2 90 5" className="art-corner" />
    </svg>
  )
}
