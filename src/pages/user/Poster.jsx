import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Page, Text, View, Image, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import PosterPDF from "@/components/Poster"

const missingPersons = [
  {
    id: "1",
    name: "John Doe",
    photo: "/images/missing-example.jpg",
    contactNo: "123-456-7890",
    lastSeen: "2023-05-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    photo: "/images/missing-example.jpg",
    contactNo: "987-654-3210",
    lastSeen: "2023-05-20",
  },
]


export default function CreatePosterPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)

  useEffect(() => {
    const foundPerson = missingPersons.find((p) => p.id === id)
    setPerson(foundPerson || null)
  }, [id])

  if (!person) {
    return <div>Person not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* 🖼️ Poster Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6"
      >
        <motion.img
          src={person.photo}
          alt={person.name}
          className="w-full h-64 object-cover rounded-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <h1 className="text-2xl font-bold text-red-600 text-center mt-4">MISSING PERSON</h1>
        <h2 className="text-xl font-semibold text-center">{person.name}</h2>
        <p className="text-center text-gray-700">Contact: {person.contactNo}</p>
        <p className="text-center text-gray-700">Last Seen: {person.lastSeen}</p>
        <p className="text-red-500 text-center font-semibold mt-3">
          If you have any information, please contact the authorities.
        </p>
      </motion.div>

      {/* 📥 Download PDF Button */}
      <motion.div
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <PDFDownloadLink
          document={<PosterPDF person={person} />}
          fileName={`${person.name}_missing_poster.pdf`}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded shadow-md hover:bg-blue-700 transition"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download Poster PDF")}
        </PDFDownloadLink>
      </motion.div>
    </div>
  )
}
