import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
// import { missingPersons } from "../data/getData"
// import { filterPersonsWithin10km } from "../utils/distance"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import Image from "next/image"
import { missingPersons } from "@/data/getData"
import { filterPersonsWithin10km } from "@/utils/distance"

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

const MissingPersonsMap = () => {
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [center, setCenter] = useState([28.6139, 77.209]) // Delhi coordinates
  const [filteredPersons, setFilteredPersons] = useState([])

  useEffect(() => {
    setFilteredPersons(filterPersonsWithin10km(missingPersons, center[0], center[1]))
  }, [center])

  const handleMapClick = (e) => {
    setCenter([e.latlng.lat, e.latlng.lng])
  }

  return (
    <div className="h-[600px] w-full">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} onClick={handleMapClick}>
        <ChangeView center={center} zoom={13} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredPersons.map((person) => (
          <Marker
            key={person.id}
            position={person.location}
            eventHandlers={{
              click: () => setSelectedPerson(person),
            }}
          >
            <Popup>{person.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <Sheet open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <SheetContent>
          {selectedPerson && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedPerson.name}</SheetTitle>
                <SheetDescription>Missing Person Details</SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <img
                  src={selectedPerson.image || "/placeholder.svg"}
                  alt={selectedPerson.name}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
                <p>
                  <strong>Age:</strong> {selectedPerson.age}
                </p>
                <p>
                  <strong>Last Seen:</strong> {selectedPerson.lastSeen}
                </p>
                <p>
                  <strong>Description:</strong> {selectedPerson.description}
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MissingPersonsMap

