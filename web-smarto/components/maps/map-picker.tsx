"use client"

import { useEffect } from "react"
import L from "leaflet"
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"

type MapPickerProps = {
  lat: string
  lng: string
  onChange: (location: { lat: string; lng: string }) => void
}

const markerIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function MapClickHandler({ onChange }: Pick<MapPickerProps, "onChange">) {
  useMapEvents({
    click(event) {
      onChange({
        lat: event.latlng.lat.toFixed(6).toString(),
        lng: event.latlng.lng.toFixed(6).toString(),
      })
    },
  })

  return null
}

function ChangeMapView({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])

  return null
}

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const defaultLat = -5.147665
  const defaultLng = 119.432732

  const latitude = lat ? Number(lat) : defaultLat
  const longitude = lng ? Number(lng) : defaultLng

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-md border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onChange={onChange} />
        <ChangeMapView lat={latitude} lng={longitude} />

        <Marker
          position={[latitude, longitude]}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend(event) {
              const marker = event.target
              const position = marker.getLatLng()

              onChange({
                lat: position.lat.toFixed(6).toString(),
                lng: position.lng.toFixed(6).toString(),
              })
            },
          }}
        />
      </MapContainer>
    </div>
  )
}
