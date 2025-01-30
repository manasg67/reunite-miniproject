import React, { useState, useEffect } from "react"
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
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[\w.@+-]+$/, {
      message: "Username may contain only letters, numbers, and @/./+/-/_ characters.",
    }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  middle_name: z.string().optional(),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  phone_number: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  pincode: z.string().min(6, {
    message: "Valid pincode is required.",
  }),
  dob: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in YYYY-MM-DD format.",
    }),
  gender: z.enum(["M", "F", "O"], {
    message: "Please select a valid gender.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
  latitude: z.string()
    .transform((val) => Number(val).toFixed(6))
    .pipe(z.string()),
  longitude: z.string()
    .transform((val) => Number(val).toFixed(6))
    .pipe(z.string()),
  aadhaar_image: z.any(),
  profile_picture: z.any(),
})

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [aadharPreview, setAadharPreview] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [location, setLocation] = useState({ latitude: "", longitude: "" });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      phone_number: "",
      address: "",
      state: "",
      city: "",
      pincode: "",
      dob: "",
      gender: "",
      role: "",
      latitude: "",
      longitude: "",
    },
  })

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setLocation({ latitude, longitude });
        form.setValue('latitude', latitude);
        form.setValue('longitude', longitude);
      });
    }
  };

  async function onSubmit(values) {
    const formData = new FormData();
    
    // Only append the required fields
    const requiredFields = [
      'username', 'password', 'email', 'first_name', 'last_name',
      'phone_number', 'role', 'middle_name', 'address', 'state',
      'pincode', 'dob', 'gender', 'latitude', 'longitude', 'city'
    ];

    requiredFields.forEach(field => {
      formData.append(field, values[field]);
    });

    // Handle file uploads
    if (values.aadhaar_image) {
      formData.append('aadhaar_image', values.aadhaar_image);
    }
    if (values.profile_picture) {
      formData.append('profile_picture', values.profile_picture);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/users/register_with_aadhaar/', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Registration successful:', data);
        // Store the access token
        if (data.tokens && data.tokens.access) {
          localStorage.setItem('accessToken', data.tokens.access);
          localStorage.setItem('refreshToken', data.tokens.refresh);
          navigate('/');
        } else {
          console.error('No access token received');
        }
      } else {
        console.error('Registration failed:', data);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.username')}</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.password')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('register.first_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middle_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('register.middle_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('register.last_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                    name="phone_number"
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
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.state')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.city')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.pincode')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>{t('register.dob')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                          <SelectContent>
                            <SelectItem value="M">{t('register.male')}</SelectItem>
                            <SelectItem value="F">{t('register.female')}</SelectItem>
                            <SelectItem value="O">{t('register.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.role')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('register.select_role')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrator</SelectItem>
                            <SelectItem value="LAW_ENFORCEMENT">Law Enforcement</SelectItem>
                            <SelectItem value="NGO">NGO Worker</SelectItem>
                            <SelectItem value="CITIZEN">Citizen</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" onClick={getLocation}>
                      Get Location
                    </Button>
                  </div>
                  <div className="flex gap-4 justify-between">
                    <div>
                      {aadharPreview && (
                        <div>
                          <img src={aadharPreview || "/images/aadhar.png"} alt="aadhar" className="w-20 h-20" />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="aadhaar_image"
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
                        name="profile_picture"
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

