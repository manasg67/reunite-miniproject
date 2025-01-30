import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Download, Share2, Clock, MapPin, User, Phone, Heart, AlertCircle } from "lucide-react";
import html2canvas from 'html2canvas';
import { PDFDownloadLink } from "@react-pdf/renderer";
import PosterPDF from "@/components/PosterPDF";

export default function CreatePosterPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

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
      location: "Central Park, New York"
    },
    // ... other persons
  ];

  useEffect(() => {
    const foundPerson = missingPersons.find((p) => p.id === id);
    setPerson(foundPerson || null);
  }, [id]);

  const shareToInstagram = async () => {
    setIsSharing(true);
    try {
      const posterElement = document.querySelector('.poster-content');
      const canvas = await html2canvas(posterElement);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      const zapierData = {
        image: imageData,
        caption: `MISSING PERSON: ${person.name}\nLast seen: ${person.lastSeen}\nContact: ${person.contactNo}\n#MissingPerson #Help #FindThem`,
        location: "Missing Person Alert"
      };

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <span>Person not found</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Missing Person Poster</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us spread the word and bring them home. Every share increases the chance of finding them.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Poster Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-8"
          >
            <Card className="overflow-hidden shadow-xl poster-content">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <motion.img
                    src={person.photo}
                    alt={person.name}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                    MISSING
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{person.name}</h2>
                    <div className="flex justify-center items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Missing since {person.missingSince}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Age: {person.age}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Height: {person.height}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>Last seen: {person.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span>{person.contactNo}</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600 font-semibold">
                      If you have any information, please contact the authorities immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons and Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Share This Poster</h3>
              <p className="text-gray-600 mb-6">
                Every share increases the chance of finding {person.name}. Help us spread the word.
              </p>
              
              <div className="space-y-4">
                <PDFDownloadLink
                  document={<PosterPDF person={person} />}
                  fileName={`${person.name}_missing_poster.pdf`}
                >
                  {({ loading }) => (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {loading ? "Generating PDF..." : "Download Poster PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>

                <Button
                  onClick={shareToInstagram}
                  disabled={isSharing}
                  className="w-full h-12"
                  style={{
                    background: 'linear-gradient(45deg, #833AB4, #E1306C, #C13584)',
                    backgroundSize: '200% 200%',
                  }}
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  {isSharing ? "Sharing to Instagram..." : "Share on Instagram"}
                </Button>

                <Button 
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share with Others
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <Heart className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Help Tips</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Share this poster on your social media accounts</li>
                <li>• Print and post in community spaces</li>
                <li>• Contact local authorities if you have any information</li>
                <li>• Keep checking back for updates</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}