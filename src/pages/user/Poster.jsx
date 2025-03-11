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
import axios from 'axios';

// Add this array as a fallback
const defaultTips = [
  "Share this poster on your social media accounts",
  "Print and post in community spaces",
  "Contact local authorities if you have any information",
  "Keep checking back for updates"
];

// Instead of importing a default image, we'll use a placeholder URL
const DEFAULT_IMAGE = '/assets/default-missing.jpg';

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
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`http://127.0.0.1:8000/api/missing-persons/missing-persons/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        setPerson(response.data);
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

  // Function to get proper image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return DEFAULT_IMAGE;
    if (photoUrl.startsWith('http')) return photoUrl;
    if (photoUrl.startsWith('/')) return `http://127.0.0.1:8000${photoUrl}`;
    return `http://127.0.0.1:8000/${photoUrl}`;
  };

  const shareToInstagram = async () => {
    try {
      setIsConverting(true);
      setUploadStatus(t('poster.share.preparing'));
      
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }
      
      // First, ensure we have the image in a proper format
      const imageUrl = getImageUrl(person.photo);
      
      // Create a temporary canvas to draw the poster
      const posterElement = document.querySelector('.poster-content');
      if (!posterElement) {
        throw new Error('Poster element not found');
      }

      // Generate canvas
      setUploadStatus(t('poster.share.generating_image'));
      const canvas = await html2canvas(posterElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2
      });

      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      
      // Create form data
      setUploadStatus(t('poster.share.uploading'));
      const formData = new FormData();
      formData.append('image', blob, 'missing-person.jpg');
      formData.append('caption', `Missing Person Alert: ${person.name}\nLast seen: ${person.lastSeen}\nContact: ${person.contactNo}`);

      const response = await fetch(
        'http://127.0.0.1:8000/api/missing-persons/missing-persons/convert-and-post/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
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
      alert('Successfully shared to Instagram!');
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      alert('Failed to share to Instagram: ' + error.message);
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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Missing Person Poster</h1>
          <p className="text-gray-600">Case Number: {person.case_number}</p>
        </motion.div>

        {isConverting && <LoadingOverlay message={uploadStatus} />}

        {/* Main Poster Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Card className="overflow-hidden shadow-xl poster-content">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Photo */}
                <div className="relative">
                  <motion.img
                    src={getImageUrl(person.photo)}
                    alt={person.name}
                    className="w-full h-[500px] object-cover rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                    {person.status}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{person.name}</h2>
                    <div className="flex justify-center items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Missing since {new Date(person.missingSince).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-gray-700">
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
                    <div className="grid grid-cols-2 gap-4">
                      <p>Hair: {person.hairColor}</p>
                      <p>Eyes: {person.eyeColor}</p>
                      <p>Build: {person.build}</p>
                      {person.identifyingMarks && <p>Identifying Marks: {person.identifyingMarks}</p>}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p>Emergency Contact: {person.emergencyContactName}</p>
                    <p>Phone: {person.contactNo}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* Share This Poster */}
          <Card className="p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Share This Poster</h3>
            <div className="space-y-4">
              <PDFDownloadLink
                document={<PosterPDF person={person} />}
                fileName={`missing-person-${person.name}.pdf`}
              >
                {({ loading }) => (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    <Download className="w-5 h-5 mr-2" />
                    {loading ? t('poster.share.generating_pdf') : t('poster.share.download_pdf')}
                  </Button>
                )}
              </PDFDownloadLink>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                onClick={shareToInstagram}
                disabled={isConverting}
              >
                <Instagram className="w-5 h-5 mr-2" />
                {isConverting ? t('poster.share.posting') : t('poster.share.instagram')}
              </Button>

              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                <Share2 className="w-5 h-5 mr-2" />
                {t('poster.share.share_others')}
              </Button>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6 shadow-lg bg-blue-50">
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
        </motion.div>

        {/* Help Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">{t('poster.help_tips.title')}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {(t('poster.help_tips.tips', { returnObjects: true }) || defaultTips).map((tip, index) => (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow">
                <Heart className="w-5 h-5 mr-3 text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}