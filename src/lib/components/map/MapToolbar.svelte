<script lang="ts">
  let cluster = false
  let heat = false
  let eye = true
 

  export let fields: string[] = []

  export let click_cluster = (/** @type {boolean} */ eye: boolean) => {}
  export let click_reset = () => {}
  export let click_heat = (/** @type {boolean} */ heat: boolean) => {}
  export let click_eye = (/** @type {boolean} */ eye: boolean) => {}
  export let click_lasso = () => {}

  export let changeHeatOptions = (options: {
    radius: number
    blur: number
  }) => {}

  function clickHeat() {
    heat = !heat
    click_heat(heat)
  }
  function clickEye() {
    eye = !eye
    click_eye(eye)
  }

  let heatValues = {
    radius: 35,
    blur: 35,
  }
</script>

<div class="bg-primary-100 flex gap-2 rounded p-1">
  {#if eye}
    <button on:click={click_lasso}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="gray"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-lasso-select"
      >
        <path d="M7 22a5 5 0 0 1-2-4" />
        <path d="M7 16.93c.96.43 1.96.74 2.99.91" />
        <path
          d="M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2"
        />
        <path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path
          d="M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14v0z"
        />
      </svg>
    </button>
  {/if}
  <button
    type="button"
    class="single-click"
    on:click={() => {
      click_reset()
    }}
    title="Reset View"
  >
    <svg
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke="gray"
    >
      <path
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      ></path>
    </svg>
  </button>
  <button
    type="button"
    on:click={e => {
      e.preventDefault()
      cluster = !cluster
      click_cluster(cluster)
    }}
    class:selected={cluster}
    title="Show Markers"
  >
    <svg
      style="width:30px;height:30px"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        fill="#000000"
        fill-rule="evenodd"
        d="M8 0a2.25 2.25 0 00-.75 4.372v.465a3.25 3.25 0 00-1.797 1.144l-.625-.366a2.25 2.25 0 10-1.038 1.13l1.026.602a3.261 3.261 0 000 1.306l-1.026.601a2.25 2.25 0 101.038 1.13l.625-.366a3.25 3.25 0 001.797 1.145v.465a2.25 2.25 0 101.5 0v-.465a3.25 3.25 0 001.797-1.145l.625.366a2.25 2.25 0 101.038-1.13l-1.026-.6a3.26 3.26 0 000-1.307l1.026-.601a2.25 2.25 0 10-1.038-1.13l-.625.365A3.251 3.251 0 008.75 4.837v-.465A2.25 2.25 0 008 0zm-.75 2.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM2.75 4a.75.75 0 100 1.5.75.75 0 000-1.5zm0 6.5a.75.75 0 100 1.5.75.75 0 000-1.5zm4.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm6-3.25a.75.75 0 100 1.5.75.75 0 000-1.5zm0-6.5a.75.75 0 100 1.5.75.75 0 000-1.5zM6.395 7.3a1.75 1.75 0 113.21 1.4 1.75 1.75 0 01-3.21-1.4z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  <div class="dropdown dropdown-end dropdown-hover">
    <button
      type="button"
      on:click={clickHeat}
      class:selected={heat}
      title="Heatmap"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="gray"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-flame"
      >
        <path
          d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        />
      </svg>
    </button>
    <div
      tabindex="0"
      class="card dropdown-content card-compact z-[1] w-64 bg-base-300 p-2 text-base-content shadow"
    >
      <div>
        Blur <input
          type="range"
          min="0"
          max="50"
          bind:value={heatValues.blur}
          class="range"
          on:change={() => changeHeatOptions(heatValues)}
        />
      </div>
      <div>
        Radius <input
          type="range"
          min="15"
          max="100"
          bind:value={heatValues.radius}
          class="range"
          on:change={() => changeHeatOptions(heatValues)}
        />
      </div>
    </div>
  </div>

  <!-- <button type="button" on:click={clickEye} class:selected={eye}>
    <svg
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={eye ? 2 : 1}
      viewBox="0 0 24 24"
      stroke="gray"
    >
      {#if eye}
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        ></path>
      {:else}
        <path
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        ></path>
      {/if}
    </svg>
  </button> -->

</div>

<style>
  button {
    width: 2rem;
    height: 2rem;
    border: 0;
    background-color: transparent;
    transition-property: background-color, background-opacity;
    transition-duration: 250ms;
    border-radius: 0.375rem;
  }

  .single-click:hover {
    background-opacity: 50%;
    background-color: lightgray;
  }
</style>
