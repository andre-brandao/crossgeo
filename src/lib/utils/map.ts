import type { AddressInfo, LatLongInfo, FieldsInfo } from '$db/schema'

export function isAdressInfo(info: FieldsInfo): info is AddressInfo {
  return 'address_field' in info
}

export function isLatLongInfo(info: FieldsInfo): info is LatLongInfo {
  return 'lat_field' in info
}
