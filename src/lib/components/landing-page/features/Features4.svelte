<script>
  import BlurFade from '$lib/components/BlurFade.svelte'
  import * as m from '$msgs'
</script>

<section class="  body-font">
  <div class="container mx-auto flex flex-wrap px-5 py-24">
    <div class="flex w-full flex-col items-center xl:flex-row">
      <div class=" md:py-6 md:pr-10">
        <div class="relative flex pb-12">
          <div
            class="absolute inset-0 flex h-full w-10 items-center justify-center"
          >
            <div class="pointer-events-none h-full w-1 bg-accent"></div>
          </div>
          <div
            class="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-content"
          >
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
              class="lucide lucide-sheet"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="3" x2="21" y1="9" y2="9" />
              <line x1="3" x2="21" y1="15" y2="15" />
              <line x1="9" x2="9" y1="9" y2="21" />
              <line x1="15" x2="15" y1="9" y2="21" />
            </svg>
          </div>
          <BlurFade delay={0.1}>
            <div class="flex-grow pl-4">
              <h2 class="title-font mb-1 text-sm font-medium tracking-wider">
                {m.first_step()}
              </h2>
              <p class="leading-relaxed">
                {m.desc_first_step()}
              </p>
            </div>
          </BlurFade>
        </div>
        <div class="relative flex pb-12">
          <div
            class="absolute inset-0 flex h-full w-10 items-center justify-center"
          >
            <div class="pointer-events-none h-full w-1 bg-accent"></div>
          </div>
          <div
            class="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-content"
          >
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
              class="lucide lucide-file-up"
            >
              <path
                d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
              />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M12 12v6" />
              <path d="m15 15-3-3-3 3" />
            </svg>
          </div>
          <BlurFade delay={0.1 * 1.5}>
            <div class="flex-grow pl-4">
              <h2 class="title-font mb-1 text-sm font-medium tracking-wider">
                {m.second_step()}
              </h2>
              <p class="leading-relaxed">
                {m.second_step_desc()}
              </p>
            </div>
          </BlurFade>
        </div>
        <div class="relative flex pb-12">
          <div
            class="absolute inset-0 flex h-full w-10 items-center justify-center"
          >
            <div class="pointer-events-none h-full w-1 bg-accent"></div>
          </div>
          <div
            class="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-content"
          >
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
              class="lucide lucide-chart-column-big"
            >
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <rect x="15" y="5" width="4" height="12" rx="1" />
              <rect x="7" y="8" width="4" height="9" rx="1" />
            </svg>
          </div>
          <BlurFade delay={0.1 * 2}>
            <div class="flex-grow pl-4">
              <h2 class="title-font mb-1 text-sm font-medium tracking-wider">
                {m.third_step()}
              </h2>
              <p class="leading-relaxed">
               {m.third_step_desc()}
              </p>
            </div>
          </BlurFade>
        </div>
        <!-- <div class="relative flex pb-12">
          <div
            class="absolute inset-0 flex h-full w-10 items-center justify-center"
          >
            <div class="pointer-events-none h-full w-1 bg-accent"></div>
          </div>
          <div
            class="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-content"
          >
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="h-5 w-5"
              viewBox="0 0 24 24"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="flex-grow pl-4">
            <h2 class="title-font mb-1 text-sm font-medium tracking-wider">
             Quarto passo
            </h2>
            <p class="leading-relaxed">
              Aprofunde-se nos insights. Com os gráficos personalizados prontos, explore seus dados para tomar decisões informadas e identificar tendências importantes.
            </p>
          </div>
        </div> -->
        <div class="relative flex">
          <div
            class="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-content"
          >
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
              class="lucide lucide-file-chart-pie"
            >
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5" />
              <path d="M4.017 11.512a6 6 0 1 0 8.466 8.475" />
              <path
                d="M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z"
              />
            </svg>
          </div>
          <BlurFade delay={0.1 * 2.5}>
            <div class="flex-grow pl-4">
              <h2 class="title-font mb-1 text-sm font-medium tracking-wider">
                {m.fourth_step()}
              </h2>
              <p class="leading-relaxed">
                {m.fourth_step_desc()}
              </p>
            </div>
          </BlurFade>
        </div>
      </div>
      <BlurFade delay={0.1 * 3}>
        <div class="mt-12 md:mt-0">
          <img
            class="rounded-lg object-cover object-center"
            src="/src/lib/assets/home/mapa.png"
            alt="step"
          />
        </div>
      </BlurFade>
    </div>
  </div>
</section>
