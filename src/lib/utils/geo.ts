import { GOOGLE_MAPS_KEY } from '$env/static/private'

import {
  Client,
} from '@googlemaps/google-maps-services-js'
const maps_client = new Client({})

export async function geocodeAddress(address: string) {
  console.log('Geocodificando: ' + address)
  try {
    const result = await maps_client.geocode({
      params: {
        address: address,
        key: GOOGLE_MAPS_KEY,
      },
    })

    const location = result.data.results[0]?.geometry.location
    return location
  } catch (e) {
    console.error(e)
    console.warn(`Erro ao geocodificar o endereço: ${address}`)
  }
}
