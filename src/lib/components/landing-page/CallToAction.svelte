<script lang="ts">

  import { icons } from "$lib/utils"
      import * as m from '$msgs'

</script>

<section class="bg-base-100">
    <div class="container flex flex-col items-center px-4 py-12 mx-auto xl:flex-row">
        <div class="flex justify-center xl:w-1/2">
            <img class="h-80 w-80 sm:w-[28rem] sm:h-[28rem] flex-shrink-0 object-cover rounded-full" src="/landing-page/picturelaptop.png" alt="">
        </div>

        <div class="flex flex-col items-center mt-6 xl:items-start xl:w-1/2 xl:mt-0">
            <h2 class="inline-flex animate-text-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-[200%_auto] bg-clip-text text-2xl py-2 font-semibold tracking-tight  xl:text-4xl max-w-xl text-transparent">
                {m.smart_decisions()} 
            </h2>

            <p class="block max-w-xl mt-4 ">{m.your_solution()} </p>

            <div class="mt-6 flex justify-end">
                <a href="/map/1"
                    class="btn btn-primary">
                    <span class="mx-2">
                        {m.start_now()}
                    </span>
                    {@html icons.globe()}
                </a>
            </div>
        </div>
    </div>
</section>