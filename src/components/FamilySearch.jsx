"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const familyMembers = [
  {
    id: 1,
    name: "John Doe",
    surname: "Doe",
    gender: "male",
    height: 180,
    weight: 75,
    dob: "1990-01-01",
    bloodGroup: "A+",
  },
  {
    id: 2,
    name: "Jane Doe",
    surname: "Doe",
    gender: "female",
    height: 165,
    weight: 60,
    dob: "1992-05-15",
    bloodGroup: "B-",
  },
  {
    id: 3,
    name: "Mike Smith",
    surname: "Smith",
    gender: "male",
    height: 175,
    weight: 70,
    dob: "1985-11-30",
    bloodGroup: "O+",
  },
]

export function FamilyMemberSelect({ onSelect }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? familyMembers.find((member) => member.name === value)?.name
            : "Select family member..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search family member..." />
          <CommandList>
            <CommandEmpty>No family member found.</CommandEmpty>
            <CommandGroup>
              {familyMembers.map((member) => (
                <CommandItem
                  key={member.id}
                  onSelect={() => {
                    setValue(member.name)
                    setOpen(false)
                    onSelect(member)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === member.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {member.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
