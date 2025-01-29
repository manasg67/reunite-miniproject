"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import SearchableLocationInput from "./loactionSearch"
import { FamilyMemberSelect } from "./FamilySearch"
// import { FamilyMemberSelect } from "./family-member-select"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const genders = ["male", "female", "other"]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  height: z.number().min(50).max(300),
  weight: z.number().min(1).max(500),
  aadharPhoto: z.any().refine((file) => file?.length > 0, "Aadhar photo is required."),
  personPhoto: z.any().refine((file) => file?.length > 0, "Missing person's photo is required."),
  dob: z.string().min(1, { message: "Date of birth is required." }),
  bloodGroup: z.enum(bloodGroups, { required_error: "Please select a blood group." }),
  missingDate: z.string().min(1, { message: "Missing date is required." }),
  missingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format."),
  lastLocation: z.string().min(1, { message: "Last known location is required." }),
})

const ReportMissing = () => {
  const [isFamilyMember, setIsFamilyMember] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      gender: undefined,
      height: undefined,
      weight: undefined,
      bloodGroup: undefined,
      missingTime: "",
      lastLocation: "",
    },
  })

  const handleFamilyMemberToggle = (checked) => {
    setIsFamilyMember(checked)
    if (!checked) {
      form.reset()
    }
  }

  const handleFamilyMemberSelect = (member) => {
    form.setValue("name", member.name)
    form.setValue("surname", member.surname)
    form.setValue("gender", member.gender)
    form.setValue("height", member.height)
    form.setValue("weight", member.weight)
    form.setValue("dob", member.dob)
    form.setValue("bloodGroup", member.bloodGroup)
  }

  const onSubmit = (data) => {
    // Here you would typically send the data to your backend
    console.log(data)
  }

  return (
    <div className="mx-auto h-fullp-4 flex flex-col justify-center items-center relative top-20 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Report Missing Person</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl w-full relative ">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              id="family-member"
              onChange={(e) => handleFamilyMemberToggle(e.target.checked)}
            />
            <Label htmlFor="family-member">Family Member</Label>
          </div>

          {isFamilyMember && (
            <FormItem>
              <FormLabel>Select Family Member</FormLabel>
              <FamilyMemberSelect onSelect={handleFamilyMemberSelect} />
            </FormItem>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={isFamilyMember} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={isFamilyMember} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isFamilyMember}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                      readOnly={isFamilyMember}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                      readOnly={isFamilyMember}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="aadharPhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhar Photo</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personPhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Missing Person's Photo</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} readOnly={isFamilyMember} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isFamilyMember}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="missingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Missing Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="missingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Missing Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="lastLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Known Location</FormLabel>
                <FormControl>
                  <SearchableLocationInput onLocationSelect={(location) => field.onChange(location)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit Report</Button>
        </form>
      </Form>
    </div>
  )
}

export default ReportMissing

