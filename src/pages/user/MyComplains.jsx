"use client"

import React from "react"
// import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const missingPersons= [
  {
    id: "1",
    name: "John Doe",
    photo: "/images/missing-example.jpg",
    contactNo: "123-456-7890",
    age: "25",
    height: "5'10\"",
    weight: "160 lbs",
    lastSeen: "2023-05-15",
    missingSince: "2023-05-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    photo: "/images/missing-example.jpg",
    contactNo: "987-654-3210",
    age: "25",
    height: "5'10\"",
    weight: "160 lbs",
    lastSeen: "2023-05-20",
    missingSince: "2023-05-15",
  },
]

const MissingPersonCard = ({ person }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={person.photo || "/placeholder.svg"} alt={person.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
        <p className="text-gray-600 mb-1">
          {t('my_complains.card.contact')}: {person.contactNo}
        </p>
        <p className="text-gray-600 mb-4">
          {t('my_complains.card.last_seen')}: {person.lastSeen}
        </p>
        <Link to={`/create-poster/${person.id}`}>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            {t('my_complains.card.view_details')}
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

export default function MyReportsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12  px-4 sm:px-6 lg:px-8">
        <div className="relative top-20">

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-8"
      >
        {t('my_complains.title')}
      </motion.h1>
      <div className="max-w-7xl relative mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {missingPersons.length > 0 ? (
          missingPersons.map((person) => (
            <MissingPersonCard key={person.id} person={person} />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            {t('my_complains.card.no_reports')}
          </p>
        )}
      </div>
        </div>
    </div>
  )
}

