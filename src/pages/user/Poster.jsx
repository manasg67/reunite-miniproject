import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Download, Share2, Clock, MapPin, User, Phone, Heart, AlertCircle, Droplets } from "lucide-react";
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
  const [isSharing, setIsSharing] = useState(false);
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
    const fetchPerson = async () => {
      try {
        const response = await fetch(`/api/missing-persons/missing-persons/${id}`);
        if (!response.ok) throw new Error('Failed to fetch person data');
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error('Error fetching person:', error);
        // Fallback to static data if API fails
        const foundPerson = missingPersons.find(p => p.id === id);
        if (foundPerson) {
          setPerson(foundPerson);
        } else {
          alert(t('poster.not_found'));
          navigate('/my-complains');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [id, navigate, t]);

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
    return <div>{t('poster.not_found')}</div>;
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
          {isConverting && <LoadingOverlay message={uploadStatus} />}
          <div className="container mx-auto px-4 py-8 mt-16">
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:sticky top-24"
              >
                <Card className="overflow-hidden shadow-xl poster-content">
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <motion.img
                        src={person.photo || '/placeholder-image.jpg'}
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
                          <span>Missing since {new Date(person.missingSince).toLocaleDateString()}</span>
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
                          <Droplets className="h-4 w-4 text-blue-600" />
                          <span>Blood Group: {person.bloodGroup}</span>
                        </div>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Physical Description</h3>
                        <p>Hair: {person.hairColor}</p>
                        <p>Eyes: {person.eyeColor}</p>
                        <p>Build: {person.build}</p>
                        {person.identifyingMarks && <p>Identifying Marks: {person.identifyingMarks}</p>}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Contact Information</h3>
                        <p>Emergency Contact: {person.emergencyContactName}</p>
                        <p>Phone: {person.contactNo}</p>
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
                </Card>

                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-600 mb-4">
                    <Heart className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">Additional Information</h3>
                  </div>
                  <div className="space-y-3 text-gray-700">
                    {person.lastSeenWearing && (
                      <p>Last Seen Wearing: {person.lastSeenWearing}</p>
                    )}
                    {person.lastSeenDetails && (
                      <p>Details: {person.lastSeenDetails}</p>
                    )}
                    {person.medicalConditions && (
                      <p>Medical Conditions: {person.medicalConditions}</p>
                    )}
                  </div>
                </Card>

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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}