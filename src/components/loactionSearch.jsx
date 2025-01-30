import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const SearchableLocationInput = ({ onLocationSelect }) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [locations, setLocations] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    const fetchLocations = async () => {
      if (searchQuery.length < 3) {
        setLocations([])
        return
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
        )

        const data = await response.json()
        setLocations(
          data.map((item) => ({
            coordinates: `${item.lon},${item.lat}`,
            displayName: item.display_name,
            latitude: item.lat,
            longitude: item.lon
          })),
        )
      } catch (error) {
        console.error("Error fetching locations:", error)
        setLocations([])
      }
    }

    fetchLocations()
  }, [searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between truncate">
          {value || "Search for a location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search for a location..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.displayName}
                  onSelect={() => {
                    setValue(location.displayName)
                    onLocationSelect({
                      displayName: location.displayName,
                      coordinates: location.coordinates,
                      latitude: location.latitude,
                      longitude: location.longitude
                    })
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === location.displayName ? "opacity-100" : "opacity-0")} />
                  {location.displayName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchableLocationInput