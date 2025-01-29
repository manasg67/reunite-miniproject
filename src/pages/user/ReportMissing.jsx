import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Upload, Clock, MapPin } from "lucide-react";
import SearchableLocationInput from "@/components/loactionSearch";
import { FamilyMemberSelect } from "@/components/FamilySearch";
import { useTranslation } from "react-i18next";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const genders = ["male", "female", "other"]

const ReportMissing = () => {
  const { t, i18n } = useTranslation();

  // Move schema definition inside component to access t function
  const formSchema = z.object({
    name: z.string().min(2, { message: t('report_missing.form.validation.name_min') }),
    surname: z.string().min(2, { message: t('report_missing.form.validation.surname_min') }),
    gender: z.enum(["male", "female", "other"], { required_error: t('report_missing.form.validation.gender_required') }),
    height: z.number().min(50).max(300, { message: t('report_missing.form.validation.height_range') }),
    weight: z.number().min(1).max(500, { message: t('report_missing.form.validation.weight_range') }),
    aadharPhoto: z.any().refine((file) => file?.length > 0, t('report_missing.form.validation.aadhaar_required')),
    personPhoto: z.any().refine((file) => file?.length > 0, t('report_missing.form.validation.photo_required')),
    dob: z.string().min(1, { message: t('report_missing.form.validation.dob_required') }),
    bloodGroup: z.enum(bloodGroups, { required_error: t('report_missing.form.validation.blood_group_required') }),
    missingDate: z.string().min(1, { message: t('report_missing.form.validation.missing_date_required') }),
    missingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('report_missing.form.validation.time_invalid')),
    lastLocation: z.string().min(1, { message: t('report_missing.form.validation.location_required') }),
  })

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

  const translateGenderToEnglish = (gender) => {
    // Create a mapping of Hindi to English gender values
    const genderMap = {
      'पुरुष': 'male',
      'महिला': 'female',
      'अन्य': 'other'
    };
    return genderMap[gender] || gender; // Return mapped value or original if not found
  };

  const translateBloodGroupToEnglish = (bloodGroup) => {
    // Blood groups are same in both languages, but adding for completeness
    return bloodGroup;
  };

  const onSubmit = (data) => {
    // Create a copy of the data to modify
    const formDataInEnglish = {
      ...data,
      // Ensure gender is in English
      gender: translateGenderToEnglish(data.gender),
      // Ensure blood group is in English
      bloodGroup: translateBloodGroupToEnglish(data.bloodGroup),
      // Files and numbers don't need translation
      height: data.height,
      weight: data.weight,
      aadharPhoto: data.aadharPhoto,
      personPhoto: data.personPhoto,
      // Dates and times are already in standard format
      dob: data.dob,
      missingDate: data.missingDate,
      missingTime: data.missingTime,
      // Location might need special handling if you're using a location service
      lastLocation: data.lastLocation,
    };

    // Log the English data that will be sent to the API
    console.log('Data to be sent to API:', formDataInEnglish);

    // Here you would send the English data to your backend
    // apiCall(formDataInEnglish);
  }

  return (
    <div className="min-h-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('report_missing.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('report_missing.subtitle')}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  {t('report_missing.form_title')}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {t('report_missing.form_description')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Family Member Toggle */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      id="family-member"
                      onChange={(e) => handleFamilyMemberToggle(e.target.checked)}
                    />
                    <Label htmlFor="family-member" className="font-medium text-gray-700">
                      {t('report_missing.family_member.toggle')}
                    </Label>
                  </div>
                  
                  {isFamilyMember && (
                    <div className="mt-4">
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          {t('report_missing.family_member.select')}
                        </FormLabel>
                        <FamilyMemberSelect onSelect={handleFamilyMemberSelect} className="bg-black"/>
                      </FormItem>
                    </div>
                  )}
                </div>

                {/* Personal Information Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t('report_missing.sections.personal_info')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t('report_missing.form.name')}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500" 
                              readOnly={isFamilyMember}
                            />
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
                          <FormLabel className="text-gray-700">{t('report_missing.form.surname')}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                              readOnly={isFamilyMember}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t('report_missing.form.gender.label')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isFamilyMember}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder={t('report_missing.form.gender.select')} />
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

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t('report_missing.form.height')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
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
                          <FormLabel className="text-gray-700">{t('report_missing.form.weight')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                              onChange={(e) => field.onChange(+e.target.value)}
                              readOnly={isFamilyMember}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-gray-500" />
                    {t('report_missing.sections.documents')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="aadharPhoto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t('report_missing.form.documents.aadhaar')}</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                  <p className="text-sm text-gray-500">{t('report_missing.form.documents.upload_prompt')}</p>
                                </div>
                                <Input type="file" className="hidden" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                              </label>
                            </div>
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
                          <FormLabel className="text-gray-700">{t('report_missing.form.documents.person')}</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                  <p className="text-sm text-gray-500">{t('report_missing.form.documents.upload_prompt')}</p>
                                </div>
                                <Input type="file" className="hidden" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Missing Details Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    {t('report_missing.sections.missing_details')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="missingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t('report_missing.form.missing_details.date')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
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
                      name="missingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">{t('report_missing.form.missing_details.time')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="lastLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {t('report_missing.form.missing_details.location')}
                          </FormLabel>
                          <FormControl>
                            <SearchableLocationInput 
                              onLocationSelect={(location) => field.onChange(location)}
                              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transform transition-transform duration-200 hover:scale-105"
                  >
                    {t('report_missing.form.submit')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportMissing;
