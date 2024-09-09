<script lang="ts">

  import { icons } from "$lib/utils"

</script>

<section class="bg-base-100">
    <div class="container flex flex-col items-center px-4 py-12 mx-auto xl:flex-row">
        <div class="flex justify-center xl:w-1/2">
            <img class="h-80 w-80 sm:w-[28rem] sm:h-[28rem] flex-shrink-0 object-cover rounded-full" src="/landing-page/picturelaptop.png" alt="">
        </div>

        <div class="flex flex-col items-center mt-6 xl:items-start xl:w-1/2 xl:mt-0">
            <h2 class="text-2xl font-semibold tracking-tight  xl:text-3xl max-w-xl ">
                Transforme dados em decisões Inteligentes com Crossgeo! 🌍
            </h2>

            <p class="block max-w-xl mt-4 ">Sua solução definitiva para transformar dados geoespaciais em insights valiosos. Com nossa plataforma intuitiva e poderosa, você pode visualizar, interpretar e tomar decisões informadas com facilidade. </p>

            <div class="mt-6 flex justify-end">
                <a href="/login"
                    class="btn btn-primary">
                    <span class="mx-2">
                        Comece agora! 
                    </span>
                    {@html icons.globe()}
                </a>
            </div>
        </div>
    </div>
</section>