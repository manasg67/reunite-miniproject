import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Clock, MapPin, Plus, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import SearchableLocationInput from "@/components/loactionSearch"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const genders = ["M", "F", "Other"]
const complexions = ["Fair", "Medium", "Dark"]
const statuses = ["MISSING", "FOUND", "DECEASED"]
const documentTypes = ["POLICE_REPORT", "ID_PROOF"]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  age_when_missing: z.string().min(0),
  date_of_birth: z.string().min(1),
  gender: z.enum(genders),
  blood_group: z.enum(bloodGroups),
  nationality: z.string().min(2),
  height: z.string().min(1),
  weight: z.string().min(1),
  complexion: z.enum(complexions),
  identifying_marks: z.string().optional(),
  physical_attributes: z.object({
    hair_color: z.string(),
    eye_color: z.string(),
    build: z.string(),
  }),
  last_seen_location: z.string().min(1),
  last_seen_date: z.string().min(1),
  last_seen_details: z.string(),
  last_seen_wearing: z.string(),
  possible_locations: z.array(z.string()),
  fir_number: z.string(),
  status: z.enum(statuses),
  priority_level: z.number().min(1).max(10),
  medical_conditions: z.string(),
  medications: z.string(),
  emergency_contact_name: z.string().min(2),
  emergency_contact_phone: z.string().min(10),
  emergency_contact_relation: z.string(),
  secondary_contact_name: z.string().min(2),
  secondary_contact_phone: z.string().min(10),
  last_known_latitude: z.number().optional(),
  last_known_longitude: z.number().optional(),
  aadhaar_number: z.string().length(13),
  documents: z.array(
    z.object({
      document_type: z.enum(documentTypes),
      description: z.string(),
      file: z.any(),
    })
  ),
});
const ReportMissing = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age_when_missing: "",
      date_of_birth: "",
      gender: undefined,
      blood_group: undefined,
      nationality: "",
      height: "",
      weight: "",
      complexion: undefined,
      identifying_marks: "",
      physical_attributes: {
        hair_color: "",
        eye_color: "",
        build: "",
      },
      last_seen_location: "",
      last_seen_date: "",
      last_seen_details: "",
      last_seen_wearing: "",
      possible_locations: [],
      fir_number: "",
      status: "MISSING",
      priority_level: 5,
      medical_conditions: "",
      medications: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      emergency_contact_relation: "",
      secondary_contact_name: "",
      secondary_contact_phone: "",
      last_known_latitude: undefined,
      last_known_longitude: undefined,
      aadhaar_number: "",
      documents: [
        { document_type: "POLICE_REPORT", description: "", file: null },
        { document_type: "ID_PROOF", description: "", file: null },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  const handleLocationInput = (value) => {
    const locations = value.split(",").map((loc) => loc.trim());
    form.setValue("possible_locations", locations);
  };

  const handleLocationSelect = (selectedLocation) => {
    const [longitude, latitude] = selectedLocation.split(",")
    form.setValue("last_seen_location", selectedLocation)
    form.setValue("last_known_latitude", Number.parseFloat(latitude))
    form.setValue("last_known_longitude", Number.parseFloat(longitude))
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Handle possible_locations array
      const locations = typeof data.possible_locations === "string" 
        ? data.possible_locations.split(",").map(loc => loc.trim())
        : data.possible_locations;
      formData.append("possible_locations", JSON.stringify(locations));

      // Handle physical attributes
      formData.append("physical_attributes", JSON.stringify(data.physical_attributes));

      // Handle documents
      data.documents.forEach((doc, index) => {
        formData.append(`documents[${index}][document_type]`, doc.document_type);
        formData.append(`documents[${index}][description]`, doc.description);
        if (doc.file) {
          formData.append(`documents[${index}][file]`, doc.file);
        }
      });

      // Add remaining fields
      Object.keys(data).forEach(key => {
        if (key !== "documents" && key !== "physical_attributes" && key !== "possible_locations") {
          formData.append(key, data[key]);
        }
      });

      const response = await fetch("https://a943-2401-4900-57ef-65c5-3846-7218-fe1e-cecf.ngrok-free.app/api/missing-persons/missing-persons/", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      navigate("/my-complains");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  return (
    <div className="min-h-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("report_missing.title")}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("report_missing.subtitle")}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">{t("report_missing.form_title")}</CardTitle>
                <p className="text-sm text-gray-500">{t("report_missing.form_description")}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("report_missing.sections.personal_info")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.name")}</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age_when_missing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.age_when_missing")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.dob")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.gender.label")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder={t("report_missing.form.gender.select")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genders.map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="blood_group"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.blood_group")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder={t("report_missing.form.blood_group_select")} />
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

                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.nationality")}</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.height")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
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
                          <FormLabel className="text-gray-700">{t("report_missing.form.weight")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complexion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.complexion")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder={t("report_missing.form.complexion_select")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {complexions.map((complexion) => (
                                <SelectItem key={complexion} value={complexion}>
                                  {complexion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="identifying_marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">{t("report_missing.form.identifying_marks")}</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      {t("report_missing.form.physical_attributes")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="physical_attributes.hair_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">{t("report_missing.form.hair_color")}</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="physical_attributes.eye_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">{t("report_missing.form.eye_color")}</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="physical_attributes.build"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">{t("report_missing.form.build")}</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Missing Details Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    {t("report_missing.sections.missing_details")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="last_seen_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.missing_details.date")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_seen_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {t("report_missing.form.missing_details.location")}
                          </FormLabel>
                          <FormControl>
                            <SearchableLocationInput
                              onLocationSelect={(location) => {
                                field.onChange(location)
                                handleLocationSelect(location)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="last_seen_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">{t("report_missing.form.last_seen_details")}</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_seen_wearing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">{t("report_missing.form.last_seen_wearing")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                 

                </div>

                {/* Case Details Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("report_missing.sections.case_details")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fir_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.fir_number")}</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.status")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder={t("report_missing.form.status_select")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t("report_missing.form.priority_level")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              {...field}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Medical Information Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("report_missing.sections.medical_info")}
                  </h3>

                  <FormField
                    control={form.control}
                    name="medical_conditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">{t("report_missing.form.medical_conditions")}</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">{t("report_missing.form.medications")}</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("report_missing.sections.contact_info")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="emergency_contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.emergency_contact_name")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergency_contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.emergency_contact_phone")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergency_contact_relation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.emergency_contact_relation")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <FormField
                      control={form.control}
                      name="secondary_contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.secondary_contact_name")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secondary_contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.secondary_contact_phone")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("report_missing.sections.additional_info")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="last_known_latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.last_known_latitude")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              {...field}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_known_longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            {t("report_missing.form.last_known_longitude")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              {...field}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="aadhaar_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">{t("report_missing.form.aadhaar_number")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Documents Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-900">
        {t("report_missing.sections.documents")}
      </h3>
      <Button
        type="button"
        onClick={() => append({ document_type: "", description: "", file: null })}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Document
      </Button>
    </div>

    {fields.map((field, index) => (
      <div key={field.id} className="mb-6 p-4 border rounded-lg">
        <div className="flex justify-end mb-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => remove(index)}
            className="text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name={`documents.${index}.document_type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`documents.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`documents.${index}.file`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => onChange(e.target.files[0])}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    ))}
  </div>


                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transform transition-transform duration-200 hover:scale-105"
                  >
                    {t("report_missing.form.submit")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ReportMissing

