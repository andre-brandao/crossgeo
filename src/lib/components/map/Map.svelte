<script lang="ts">
  import { mount, unmount } from 'svelte'
  // --
  import L from 'leaflet'
  // --
  import 'leaflet.markercluster/dist/leaflet.markercluster.js'
  import 'leaflet.markercluster/dist/MarkerCluster.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  // --
  import 'leaflet.heat/dist/leaflet-heat.js'
  // --
  import 'leaflet-lasso'

  interface LassoHandlerFinishedEventData {
    originalEvent: MouseEvent
    latLngs: L.LatLng[]
    layers: L.Layer[]
  }
  type LassoHandlerFinishedEvent = L.LeafletEvent &
    LassoHandlerFinishedEventData
  // --
  import 'leaflet.locatecontrol' // Import plugin
  import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css' // Import styles
  // --

  import 'leaflet-better-filelayer'
  import 'leaflet-better-filelayer/dist/leaflet.betterfilelayer.css'

  // --==--==--==--==--
  import MapToolbar from './MapToolbar.svelte'
  import MarkerPopup from './MarkerPopup.svelte'
  //   import * as markerIcons from './markers.js'
  import type { Dataset } from './dataset'

  import { icons } from '$utils'

  let map: L.Map | null

  let lasso: L.Lasso

  export let locations: {
    latLong: L.LatLng
    metadata?: Record<string, any>
  }[] = []

  export let initialLocation: [number, number] = [-20.1260665, -44.833004]

  export let initailZoom = 12

  export let toogle_table = (v: boolean) => {}

  let baseMaps = {
    OpenStreetMap: L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    ),
    'OpenStreetMap.HOT': L.tileLayer(
      'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      },
    ),
    googleStreets: L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      },
    ),
    googleHybrid: L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      },
    ),
    googleTerrain: L.tileLayer(
      'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      },
    ),
  }

  function createMap(container: string | HTMLElement) {
    let m = L.map(container, { preferCanvas: true }).setView(
      initialLocation,
      initailZoom,
    )

    m.addEventListener('click', e => {
      console.log('click' + e.latlng)
    })

    L.tileLayer(
      // 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      // {
      //   // attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
      //   //   &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
      //   // subdomains: 'abcd',
      //   maxZoom: 14,
      // },
      'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      },
    ).addTo(m)

    lasso = L.lasso(m, { intersect: true })
    // @ts-ignore
    m.on('lasso.finished', (event: LassoHandlerFinishedEvent) => {
      console.log('Lasso event')
      console.log(event)
      setSelectedLayers(event.layers)
    })

    L.control.locate().addTo(m)
    //@ts-ignore
    L.Control.betterFileLayer({ position: 'topleft' }).addTo(m)

    const layerControl = L.control
      .layers(baseMaps, undefined, {
        position: 'bottomleft',
      })
      .addTo(m)

    m.on('bfl:layerloaded', ({ layer }) => {
      console.log(
        'My layer was successfully loaded, heres the layer object: ',
        layer,
      )

      layerControl.addOverlay(layer, 'Temporary layer')
    })
    return m
  }

  let markers = true
  let cluster = false
  let heat = false

  // @ts-ignore
  let toolbar = L.control({ position: 'topright' })
  let toolbarComponent: Record<string, any> | null

  toolbar.onAdd = (map: L.Map) => {
    let div = L.DomUtil.create('div')

    toolbarComponent = mount(MapToolbar, {
      target: div,
      props: {
        click_cluster: v => {
          cluster = v

          if (cluster && markers) {
            markers = false
          }
        },
        click_reset: () => {
          map.setView(initialLocation, initailZoom, { animate: true })
        },
        click_heat: v => {
          heat = v
          if (heat === true) {
            cluster = false
          }
        },
        click_eye: v => {
          markers = v
          if (markers === true) {
            cluster = false
          }
        },
        click_lasso: () => {
          lasso.enable()
        },
        click_table: toogle_table,
      },
    })

    return div
  }

  toolbar.onRemove = () => {
    if (toolbarComponent) {
      unmount(toolbarComponent)
      toolbarComponent = null
    }
  }

  // Create a popup with a Svelte component inside it and handle removal when the popup is torn down.
  // `createFn` will be called whenever the popup is being created, and should create and return the component.
  function bindPopup(
    marker: L.Marker<any>,
    createFn: { (m: any): Record<string, any>; (arg0: HTMLDivElement): any },
  ) {
    let popupComponent: Record<string, any> | null
    marker.bindPopup(() => {
      let container = L.DomUtil.create('div')
      // @ts-ignore
      popupComponent = createFn(container)
      return container
    })

    marker.on('popupclose', () => {
      if (popupComponent) {
        let old = popupComponent
        popupComponent = null
        // Wait to destroy until after the fadeout completes.
        setTimeout(() => {
          unmount(old)
        }, 500)
      }
    })
  }
  function resetSelectedState() {
    map?.eachLayer(layer => {
      if (layer instanceof L.Marker && !(layer instanceof L.MarkerCluster)) {
        layer.setIcon(markerIcon(1))
      }
      // else if (layer instanceof L.Path) {
      //   layer.setStyle({ color: '#3388ff' })
      // }
    })
  }
  export let lasso_selected = (layers: Dataset) => {}
  function setSelectedLayers(layers: L.Layer[]) {
    resetSelectedState()

    const arrayItems: Dataset[] = []

    layers.forEach(layer => {
      if (layer instanceof L.Marker && !(layer instanceof L.MarkerCluster)) {
        layer.setIcon(markerIcon(1, true))
        // @ts-expect-error CSV ROW DATA
        const metadata = layer.options.metadata as Dataset

        // TODO: make a filter and query library
        // console.log(metadata)
        arrayItems.push(metadata)
      }
      // else if (layer instanceof L.Path) {
      //   layer.setStyle({ color: '#ff4620' })
      // }
    })
    console.log('selected ' + layers.length + ' layers')
    lasso_selected(arrayItems)
  }

  function markerIcon(count: number, selected = false) {
    let html = `<div class="map-marker"><div>${icons.pin({
      stroke: selected ? 'red' : 'currentColor',
    })}</div><div class="marker-text">${count}</div></div>`
    return L.divIcon({
      html,
      className: 'map-marker',
    })
  }

  function clusterIcon(count: number) {
    let color = 'red'

    if (count < 4) {
      color = 'green'
    } else if (count < 10) {
      color = 'orange'
    } else if (count < 15) {
      color = 'darkorange'
    }

    let size = 24
    size += 24

    if (size > 40) {
      size = 45
    }
    let html = `<div class="map-marker"><div>${icons.boxes({
      width: size,
      height: size,
      fill: color,
    })}</div><div class="marker-text">${count}</div></div>`
    return L.divIcon({
      html,
      className: 'map-marker',
    })
  }

  function createMarker(loc: L.LatLngExpression, metadata = {}) {
    let count = Math.ceil(1)
    let icon = markerIcon(count)
    let marker = L.marker(loc, { icon })
    // @ts-expect-error  CSV ROW DATA,
    marker.options.metadata = metadata
    bindPopup(marker, (m: any) => {
      const c = mount(MarkerPopup, {
        target: m,
        props: {
          data: metadata,
          change: v => {
            count = v
            marker.setIcon(markerIcon(count))
          },
        },
      })

      return c
    })

    return marker
  }

  // function addLocation(loc) {
  //   let m = createMarker(loc)
  //   markersCluster.addLayer(m)
  //   // markerLayers.addLayer(m)
  // }

  let markerLayers: L.LayerGroup<any>

  let markersCluster: L.MarkerClusterGroup

  let markersHeat: L.HeatLayer

  function mapAction(container: HTMLDivElement) {
    map = createMap(container)
    toolbar.addTo(map)

    markerLayers = L.layerGroup()

    markersCluster = new L.MarkerClusterGroup({
      iconCreateFunction: function (cluster) {
        let count = cluster.getChildCount()
        return clusterIcon(count)
      },
    })

    markersHeat = L.heatLayer([], { radius: 35, blur: 35 })

    for (let location of locations) {
      let m = createMarker(location.latLong, location.metadata)
      markerLayers.addLayer(m)
      markersCluster.addLayer(m)
      markersHeat.addLatLng(location.latLong)
    }
    markersCluster.addTo(map)

    console.log(markerLayers)

    return {
      destroy: () => {
        toolbar.remove()
        // @ts-ignore
        map.remove()
        map = null
      },
    }
  }

  // We could do these in the toolbar's click handler but this is an example
  // of modifying the map with reactive syntax.
  $: if (markerLayers && map) {
    if (markers) {
      markerLayers.addTo(map)
    } else {
      markerLayers.remove()
    }
  }

  $: if (markersCluster && map) {
    if (cluster) {
      markersCluster.addTo(map)
    } else {
      markersCluster.remove()
    }
  }
  $: if (markersHeat && map) {
    if (heat) {
      markersHeat.addTo(map)
    } else {
      markersHeat.remove()
    }
  }

  function resizeMap() {
    if (map) {
      // @ts-ignore
      map.invalidateSize()
    }
  }
</script>

<svelte:window on:resize={resizeMap} />

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>
<div class="map" style="height:100%;width:100%" use:mapAction></div>

<style>
  .map :global(.marker-text) {
    width: 100%;
    text-align: center;
    font-weight: 600;
    background-color: #444;
    color: #eee;
    border-radius: 0.5rem;
  }

  .map :global(.map-marker) {
    width: 30px;
    transform: translateX(-50%) translateY(-25%);
  }
</style>
