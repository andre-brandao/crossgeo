<script lang="ts">
  import { cn } from "$lib/utils";

  export let shimmerColor = "#ffffff";
  export let shimmerSize = "0.05em";
  export let shimmerDuration = "3s";
  export let borderRadius = "100px";
  export let background = "#171212";
  let className: any = "";
  export { className as class };
</script>

<button
  style:--spread='90deg'
  style:--shimmer-color={shimmerColor}
  style:--speed={shimmerDuration}
  style:--cut={shimmerSize}
  style:--bg={background}
  class={cn(
      "btn btn-primary",
      "relative z-0 flex items-center justify-center overflow-hidden whitespace-nowrap",
      className
  )}
>
  <div
      class={cn(
          "-z-30 blur-[2px]",
          "absolute inset-0 overflow-visible [container-type:size]"
      )}
  >
      <div
          class="absolute inset-0 h-[100cqh] animate-magicslide [aspect-ratio:1] [border-radius:0] [mask:none]"
      >
          <!--  spark before  -->
          <div
              class="animate-spin-around absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]"
          />
      </div>
  </div>
  <slot>Shimmer Button</slot>
  <!-- Highlight -->
  <div
      class={cn(
          "absolute inset-0 h-full w-full",
          "rounded-lg px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
          // transition
          "transform-gpu transition-all duration-300 ease-in-out",
          // on hover
          "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
          // on click
          "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
      )}
  ></div>
  <!-- backdrop -->
  <div
      class={cn(
          "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
      )}
  ></div>
</button>
