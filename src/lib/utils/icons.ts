interface SVGoptions {
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  strokeLinecap?: string
  strokeLinejoin?: string
}

const DEFAULT_SVG_OPTIONS: SVGoptions = {
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function svgTemplate(inner: string, options: SVGoptions = DEFAULT_SVG_OPTIONS) {
  const {
    width = 24,
    height = 24,
    fill = 'none',
    stroke = 'currentColor',
    strokeWidth = 2,
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
  } = options
  return ` <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 24 24"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="${strokeWidth}"
      stroke-linecap="${strokeLinecap}"
      stroke-linejoin="${strokeLinejoin}"
    >
      ${inner}
    </svg>`
}

export const icons = {
  bug: (cfg?: SVGoptions) =>
    svgTemplate(
      ` <path d="m8 2 1.88 1.88" />
        <path d="M14.12 3.88 16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path
          d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"
        />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
        <path d="M6 13H2" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M22 13h-4" />
        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />`,
      cfg,
    ),
  pallete: (cfg?: SVGoptions) =>
    svgTemplate(
      `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
      />`,
      cfg,
    ),

  user: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
      cfg,
    ),

  logout: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />`,
      cfg,
    ),

  login: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />`,
      cfg,
    ),

  cart: (cfg?: SVGoptions) =>
    svgTemplate(
      `<circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path
            d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
        />`,
      cfg,
    ),

  home: (cfg?: SVGoptions) =>
    svgTemplate(
      ` <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path
            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        />`,
      cfg,
    ),

  box: (cfg?: SVGoptions) =>
    svgTemplate(
      `      <path d="m7.5 4.27 9 5.15" />
      <path
        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />`,
      cfg,
    ),

  table: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />`,
      cfg,
    ),

  search: (cfg?: SVGoptions) =>
    svgTemplate(
      `<circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />`,
      cfg,
    ),

  chart: {
    bar: (cfg?: SVGoptions) =>
      svgTemplate(
        `<path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />`,
        cfg,
      ),
    line: (cfg?: SVGoptions) =>
      svgTemplate(`<path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />`, cfg),
  },

  warning: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />`,
      cfg,
    ),
  trash: (cfg?: SVGoptions) =>
    svgTemplate(
      `
<path d="M3 6h18" />
  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  <line x1="10" x2="10" y1="11" y2="17" />
  <line x1="14" x2="14" y1="11" y2="17" />`,
      cfg,
    ),
  arrow: (cfg?: SVGoptions) =>
    svgTemplate(
      `
 <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-arrow-right"
>
  <path d="M5 12h14" />
  <path d="m12 5 7 7-7 7" />
</svg>
`,
      cfg,
    ),
  chart2: (cfg?: SVGoptions) =>
    svgTemplate(
      `
   <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-chart-column"
>
  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
  <path d="M18 17V9" />
  <path d="M13 17V5" />
  <path d="M8 17v-3" />
</svg>
  `,
      cfg,
    ),
  book: (cfg?: SVGoptions) =>
    svgTemplate(
      `
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-album"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><polyline points="11 3 11 11 14 8 17 11 17 3"/></svg>
    `,
      cfg,
    ),
  layer: (cfg?: SVGoptions) =>
    svgTemplate(
      `
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
      `,
      cfg,
    ),
  download: (cfg?: SVGoptions) =>
    svgTemplate(
      `
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        `,
      cfg,
    ),
  hide: (cfg?: SVGoptions) =>
    svgTemplate(
      `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
          `,
      cfg,
    ),
  show: (cfg?: SVGoptions) =>
    svgTemplate(
      `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            `,
      cfg,
    ),
    globe: (cfg?: SVGoptions) =>
      svgTemplate(
        `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              `,
        cfg,
      ),
      map: (cfg?: SVGoptions) =>
        svgTemplate(
          `
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pinned"><path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"/><circle cx="12" cy="8" r="2"/><path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"/></svg>
                `,
          cfg,
        ),

  flags: {
    getEmojiFlag: (lang: string) => {
      switch (lang) {
        case 'en':
          return '🇺🇸'
        case 'pt':
          return '🇧🇷'
        case 'zh':
          return '🇨🇳'
        case 'es':
          return '🇪🇸'
        case 'fr':
          return '🇫🇷'
        case 'de':
          return '🇩🇪'
        case 'ja':
          return '🇯🇵'
        case 'ko':
          return '🇰🇷'
        case 'ru':
          return '🇷🇺'
        default:
          return '🌐'
      }
    },
  },

  arrows: {
    left_line: (cfg?: SVGoptions) =>
      svgTemplate(
        ` <path d="m9 6-6 6 6 6" />
  <path d="M3 12h14" />
  <path d="M21 19V5" />`,
        cfg,
      ),
  },

  pin: (cfg?: SVGoptions) =>
    svgTemplate(
      `
     <path
    d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
  />
  <circle cx="12" cy="10" r="3" />
    `,
      cfg,
    ),

  boxes: (cfg?: SVGoptions) =>
    svgTemplate(
      `
       <path
    d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"
  />
  <path d="m7 16.5-4.74-2.85" />
  <path d="m7 16.5 5-3" />
  <path d="M7 16.5v5.17" />
  <path
    d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"
  />
  <path d="m17 16.5-5-3" />
  <path d="m17 16.5 4.74-2.85" />
  <path d="M17 16.5v5.17" />
  <path
    d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"
  />
  <path d="M12 8 7.26 5.15" />
  <path d="m12 8 4.74-2.85" />
  <path d="M12 13.5V8" />
      `,
      cfg,
    ),
}
