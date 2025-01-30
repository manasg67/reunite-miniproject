import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Download, Share2, Clock, MapPin, User, Phone, Heart, AlertCircle, Droplets } from "lucide-react";
import html2canvas from 'html2canvas';
import { PDFDownloadLink } from "@react-pdf/renderer";
import PosterPDF from "@/components/PosterPDF";

export default function CreatePosterPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await fetch(`/api/missing-persons/missing-persons/${id}`);
        if (!response.ok) throw new Error('Failed to fetch person data');
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error('Error fetching person:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  const shareToInstagram = async () => {
    setIsSharing(true);
    try {
      const posterElement = document.querySelector('.poster-content');
      const canvas = await html2canvas(posterElement);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      const zapierData = {
        image: imageData,
        caption: `MISSING PERSON: ${person.name}\nLast seen: ${person.last_seen_date}\nContact: ${person.emergency_contact_phone}\n#MissingPerson #Help #FindThem`,
        location: person.last_seen_location
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <span>Loading...</span>
          </div>
        </Card>
      </div>
    );
  }

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
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Missing Person Poster</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Case Number: {person.case_number}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
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
                    src={person.recent_photo || '/placeholder-image.jpg'}
                    alt={person.name}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                    {person.status}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{person.name}</h2>
                    <div className="flex justify-center items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Missing since {new Date(person.last_seen_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Age: {person.age_when_missing}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Height: {person.height} cm</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>Last seen: {person.last_seen_location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span>Blood Group: {person.blood_group}</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Physical Description</h3>
                    <p>Hair: {person.physical_attributes.hair_color}</p>
                    <p>Eyes: {person.physical_attributes.eye_color}</p>
                    <p>Build: {person.physical_attributes.build}</p>
                    {person.identifying_marks && <p>Identifying Marks: {person.identifying_marks}</p>}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p>Emergency Contact: {person.emergency_contact_name}</p>
                    <p>Phone: {person.emergency_contact_phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Share This Poster</h3>
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
                <h3 className="text-xl font-semibold">Additional Information</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                {person.last_seen_wearing && (
                  <p>Last Seen Wearing: {person.last_seen_wearing}</p>
                )}
                {person.last_seen_details && (
                  <p>Details: {person.last_seen_details}</p>
                )}
                {person.medical_conditions && (
                  <p>Medical Conditions: {person.medical_conditions}</p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}