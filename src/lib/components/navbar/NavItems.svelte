<script lang="ts">
  import { icons } from '$lib/utils/icons'

  import ThemeSwiter from './ThemeSwiter.svelte'
  import ChangeLanguage from './ChangeLanguage.svelte'

  import { modal } from '$lib/components/modal'
  import BugReportModal from '$lib/components/modal/BugReportModal.svelte'
  import * as m from '$msgs'

  import {
    setLanguageTag,
    sourceLanguageTag,
    availableLanguageTags,
    languageTag,
  } from '$lib/paraglide/runtime'

  import { page } from '$app/stores'

  type NavItem = {
    name: string
    href?: string
    subItems?: NavItem[]
    icon?: string
  }

  export let navItems: NavItem[] = [
    {
      name: m.home_page(),
      href: '/',
      icon: icons.home(),
    },
    {
      name: 'Comprar Geopoints',
      href: '/checkout',
      icon: icons.home(),
    },

    {
      name: m.maps(),
      href: '/map',
    },
  ]

  export let showDefaultItems = true

  function isActive(href?: string) {
    // TODO: Fix translation home not working

    return (
      $page.url.pathname === href ||
      $page.url.pathname === '/' + languageTag() + href ||
      ($page.url.pathname === '/' + languageTag() && href === '/')
    )
  }
</script>

{#each navItems as navItem, i (navItem.href)}
  {@const { name, icon } = navItem}
  <li>
    {#if navItem.subItems}
      <details>
        <summary>
          <!-- {#if typeof navItem.icon === 'string'}
            {@html icon}
          {/if} -->
          {name}
        </summary>
        <ul>
          {#each navItem.subItems as subItem, i (subItem.href)}
            {#if subItem.subItems}
              <svelte:self navItems={[subItem]} showDefaultItems={false} />
            {:else}
              <li>
                <a
                  href={subItem.href}
                  aria-current={isActive(subItem.href) ? 'page' : undefined}
                  class:active={isActive(subItem.href)}
                >
                  <!-- {#if typeof navItem.icon === 'string'}
                    {@html icon}
                  {/if} -->

                  {subItem.name}
                </a>
              </li>
            {/if}
          {/each}
        </ul>
      </details>
    {:else}
      <a
        href={navItem.href}
        aria-current={isActive(navItem.href) ? 'page' : undefined}
        class:active={isActive(navItem.href)}
      >
        <!-- {#if typeof navItem.icon === 'string'}
          {@html icon}
        {/if} -->
        {name}
      </a>
    {/if}
  </li>
{/each}

{#if showDefaultItems}
  <li>
    <button class="" onclick={() => modal.open(BugReportModal)}>
      {@html icons.bug()}
    </button>
  </li>
{/if}

<style>
  a[aria-current='page']::before {
    view-transition-name: active-page;
    content: '●';
  }
</style>
