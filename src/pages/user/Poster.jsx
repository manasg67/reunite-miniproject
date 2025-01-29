import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import html2canvas from 'html2canvas'
import { Page, Text, View, Image, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import PosterPDF from "@/components/PosterPDF"

const missingPersons = [
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

export default function CreatePosterPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    const foundPerson = missingPersons.find((p) => p.id === id)
    setPerson(foundPerson || null)
  }, [id])

  const shareToInstagram = async () => {
    setIsSharing(true);
    try {
      // Create a canvas from the poster content
      const posterElement = document.querySelector('.poster-content');
      const canvas = await html2canvas(posterElement);
      
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Prepare the data for Zapier webhook
      const zapierData = {
        image: imageData,
        caption: `MISSING PERSON: ${person.name}\nLast seen: ${person.lastSeen}\nContact: ${person.contactNo}\n#MissingPerson #Help #FindThem`,
        location: "Missing Person Alert"
      };

      // Send to Zapier webhook
      const response = await fetch('YOUR_ZAPIER_WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zapierData)
      });

      if (!response.ok) throw new Error('Failed to share to Instagram');

      alert('Successfully shared to Instagram!');
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      alert('Error sharing to Instagram: ' + error.message);
    } finally {
      setIsSharing(false);
    }
  };

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
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg relative top-20 overflow-hidden p-6 poster-content"
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

      {/* Action Buttons - moved outside poster-content */}
      <motion.div
        className="mt-6 space-y-4 w-full max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Download PDF Button */}
        <PDFDownloadLink
          document={<PosterPDF person={person} />}
          fileName={`${person.name}_missing_poster.pdf`}
          className="block px-6 py-3 relative top-20 bg-blue-600 text-white font-semibold rounded shadow-md hover:bg-blue-700 transition text-center"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download Poster PDF")}
        </PDFDownloadLink>

        {/* Share to Instagram Button - using standard RGB colors */}
        <Button
          onClick={shareToInstagram}
          disabled={isSharing}
          className="w-full relative top-20 bg-[#833AB4] hover:bg-[#6D2F96] text-white font-semibold py-3 px-6 rounded shadow-md transition-all duration-200"
          style={{
            background: 'linear-gradient(45deg, #833AB4, #E1306C)',
            backgroundSize: '200% 200%',
          }}
        >
          <Instagram className="w-5 h-5 mr-2" />
          {isSharing ? "Sharing to Instagram..." : "Share on Instagram"}
        </Button>
      </motion.div>
    </div>
  )
}
