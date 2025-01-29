
import React, { useState } from "react"
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  aadharPhoto: z.any(),
  profilePhoto: z.any(),
})

const Register = () => {
  const { t } = useTranslation();

  const [aadharPreview, setAadharPreview] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
    },
  })

  function onSubmit(values) {
    // This is where you would typically handle form submission
    console.log(values)
  }

  return (
    <section className="dark:bg-gray-900">
      <div className="flex justify-center min-h-screen" style={{ backgroundImage: "url(/images/register.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="flex items-center w-full py-10 px-2 mx-auto lg:px-12 lg:w-3/5">
          <Card className="w-full bg-opacity-[0.95] bg-gray-100 top-10 relative border border-black">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                {t('register.get_started')}
              </CardTitle>
              <CardDescription className="mt-4 text-gray-500 dark:text-gray-400">
                {t('register.setup_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.full_name')}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>{t('register.gender')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('register.select_gender')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="male">{t('register.male')}</SelectItem>
                            <SelectItem value="female">{t('register.female')}</SelectItem>
                            <SelectItem value="other">{t('register.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="johndoe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.phone')}</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.address')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('register.enter_address')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4 justify-between">
                    <div>
                      {aadharPreview && (
                        <div>
                          <img src={aadharPreview || "/images/aadhar.png"} alt="aadhar" className="w-20 h-20" />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="aadharPhoto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('register.aadhar_photo')}</FormLabel>
                            <FormControl>
                              <Input type="file" accept="image/*" onChange={(e) => {
                                field.onChange(e.target.files[0])
                                setAadharPreview(URL.createObjectURL(e.target.files[0]))
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      {profilePreview && (
                        <div>
                          <img src={profilePreview || "/images/aadhar.png"} alt="profile" className="w-20 h-20" />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="profilePhoto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('register.profile_photo')}</FormLabel>
                            <FormControl>
                              <Input type="file" accept="image/*" onChange={(e) => {
                                field.onChange(e.target.files[0])
                                setProfilePreview(URL.createObjectURL(e.target.files[0]))
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gray-700 rounded text-white">
                    {t('register.signup_button')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Register

