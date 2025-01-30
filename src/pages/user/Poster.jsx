import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Download, Share2, Clock, MapPin, User, Phone, Heart, AlertCircle } from "lucide-react";
import html2canvas from 'html2canvas';
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import PosterPDF from "@/components/PosterPDF";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

// Add this array as a fallback
const defaultTips = [
  "Share this poster on your social media accounts",
  "Print and post in community spaces",
  "Contact local authorities if you have any information",
  "Keep checking back for updates"
];

export default function CreatePosterPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Static data for missing persons
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
      location: "Downtown, Chicago"
    }
  ];

  useEffect(() => {
    // Find person from static data
    const foundPerson = missingPersons.find(p => p.id === id);
    if (foundPerson) {
      setPerson(foundPerson);
    } else {
      alert(t('poster.not_found'));
      navigate('/my-complains');
    }
    setIsLoading(false);
  }, [id, navigate, t]);

  // Update the shareToInstagram function
  const shareToInstagram = async () => {
    try {
      setIsConverting(true);
      setUploadStatus(t('poster.share.preparing'));
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwNzM2NDYyLCJpYXQiOjE3MzgxNDQ0NjIsImp0aSI6Ijg4MzQxYzgxM2Q1ZjQwNDNiMjk5NTc4ZjRlOWUwM2VjIiwidXNlcl9pZCI6MjF9.UtaULwm3-WQY1x3mthqXGudLOXG6CUyzVyEoAKP2zZI";
      
      // Generate PDF blob
      setUploadStatus(t('poster.share.generating_pdf'));
      const pdfDoc = <PosterPDF person={person} />;
      const blob = await pdf(pdfDoc).toBlob();
      
      // Create form data
      setUploadStatus(t('poster.share.uploading'));
      const formData = new FormData();
      formData.append('pdf_file', blob, `missing-person-${person.name}.pdf`);
      formData.append('caption', `Missing Person Alert: ${person.name}\nLast seen: ${person.lastSeen}\nContact: ${person.contactNo}`);

      const response = await fetch(
        'https://a943-2401-4900-57ef-65c5-3846-7218-fe1e-cecf.ngrok-free.app/api/missing-persons/missing-persons/convert-and-post/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to post to Instagram');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error posting to Instagram:', error);
    } finally {
      setIsConverting(false);
      setUploadStatus('');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!person) {
    return <div>{t('poster.not_found')}</div>;
  }

  return (
    <>
      {isConverting && <LoadingOverlay message={uploadStatus} />}
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Poster preview and sharing options */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Poster Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky top-24"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6 card-content">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-red-600">{t('poster.status')}</h2>
                  <p className="text-lg mt-2">{t('poster.missing_since')}: {person.missingSince}</p>
                </div>

                <div className="aspect-square mb-6">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-center">{person.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      <span>{t('poster.details.age')}: {person.age}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{t('poster.details.height')}: {person.height}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{t('poster.details.last_seen')}: {person.lastSeen}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>{t('poster.details.contact')}: {person.contactNo}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center text-yellow-800">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <p>{t('poster.alert')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sharing Options */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">{t('poster.share.title')}</h2>
              <p className="text-gray-600 mb-6">
                {t('poster.share.description', { name: person.name })}
              </p>

              <div className="grid gap-4">
                <PDFDownloadLink
                  document={<PosterPDF person={person} />}
                  fileName={`missing-person-${person.name}.pdf`}
                >
                  {({ loading }) => (
                    <Button className="w-full" disabled={loading}>
                      <Download className="w-5 h-5 mr-2" />
                      {loading ? t('poster.share.generating_pdf') : t('poster.share.download_pdf')}
                    </Button>
                  )}
                </PDFDownloadLink>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={shareToInstagram}
                  disabled={isConverting}
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  {isConverting ? t('poster.share.posting') : t('poster.share.instagram')}
                </Button>

                <Button className="w-full" variant="outline">
                  <Share2 className="w-5 h-5 mr-2" />
                  {t('poster.share.share_others')}
                </Button>
              </div>
            </motion.div>

            {/* Help Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-4">{t('poster.help_tips.title')}</h3>
              <ul className="space-y-3">
                {(t('poster.help_tips.tips', { returnObjects: true }) || defaultTips).map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <Heart className="w-5 h-5 mr-2 text-blue-500 mt-1" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
