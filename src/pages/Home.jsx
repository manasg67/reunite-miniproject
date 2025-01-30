import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Users, Shield, Clock, AlertTriangle, Camera, FileText, Fingerprint, Heart } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Banner from "../components/banner";
import SuccessStories from "../components/SuccessStories";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MissingPersonsMap from './MissingPersonMap';
// import MissingPersonsMap from '@/components/Maps';
// import MissingPersonsMap from "../components/MissingPersonsMap"; // Import the map component

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600"/>
          <div className="absolute inset-0 opacity-30 bg-[url('/public/pattern.svg')]"/>
          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
                  {t('home.hero.title')}
                </h1>
                <p className="text-xl md:text-2xl text-gray-100 max-w-[600px]">
                  {t('home.hero.subtitle')}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full">
                    <Heart className="h-5 w-5 text-red-300 mr-2" />
                    <span className="text-white">{t('home.hero.stats.reunited')}</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full">
                    <Shield className="h-5 w-5 text-blue-300 mr-2" />
                    <span className="text-white">{t('home.hero.stats.secure')}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative flex justify-center md:justify-end">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-30"/>
                <img
                  src="/images/mobile_1.jpg"
                  alt="Unite Hearts Initiative"
                  className="relative rounded-2xl object-cover shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Alert Section */}
        <section className="w-full py-8 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-yellow-700 animate-pulse" />
                <span className="font-bold text-yellow-900">{t('home.alert.title')}</span>
              </div>
              <p className="text-yellow-900 font-medium">{t('home.alert.message')}</p>
            </div>
          </div>
        </section>

        {/* Search Options Section */}
        <section className="w-full py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              {t('home.search.title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: FileText,
                  color: 'blue',
                  title: 'home.search.by_name.title',
                  description: 'home.search.by_name.description',
                  button: 'home.search.by_name.button',
                  path: '/search/by-name'
                },
                {
                  icon: Fingerprint,
                  color: 'green',
                  title: 'home.search.by_aadhaar.title',
                  description: 'home.search.by_aadhaar.description',
                  button: 'home.search.by_aadhaar.button',
                  path: '/search/by-aadhaar'
                },
                {
                  icon: Camera,
                  color: 'purple',
                  title: 'home.search.by_face.title',
                  description: 'home.search.by_face.description',
                  button: 'home.search.by_face.button',
                  path: '/search/by-face'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`p-4 rounded-full bg-${item.color}-100 group-hover:bg-${item.color}-200 transition-colors duration-300`}>
                    <item.icon className={`h-12 w-12 text-${item.color}-500`} />
                  </div>
                  <h3 className="text-2xl font-semibold mt-6 mb-4">{t(item.title)}</h3>
                  <p className="text-gray-600 text-center mb-6">{t(item.description)}</p>
                  <Button 
                    className={`w-full bg-${item.color}-500 hover:bg-${item.color}-600 text-white`}
                    onClick={() => navigate(item.path)}
                  >
                    {t(item.button)}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* View Nearby Missing Persons Section */}
        <section className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              {t('home.nearby.title')}
            </h2>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <MissingPersonsMap />
            </div>
            <div className="flex justify-center mt-8">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => navigate('/missing-person-map')}
              >
                {t('home.nearby.button')}
              </Button>
            </div>
          </div>
        </section>

        <SuccessStories />
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <Banner />
        </section>
      </main>
    </div>
  );
}