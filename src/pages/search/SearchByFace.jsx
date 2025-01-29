import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, AlertCircle, Image as ImageIcon, Camera, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const SearchByFace = () => {
  const { t } = useTranslation();
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [gender, setGender] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError(t('search.by_face.file_size_error'));
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(t('search.by_face.file_type_error'));
        return;
      }

      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      
      setPhoto(file);
      setPhotoPreview(previewURL);
      setError('');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!photo) {
      setError(t('search.by_face.photo_required'));
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock search results
      setSearchResults([
        {
          id: 1,
          name: "John Doe",
          age: 25,
          matchPercentage: "95%",
          lastSeen: "2024-03-15",
          location: "Mumbai",
          image: "/api/placeholder/400/400"
        },
        {
          id: 2,
          name: "Jane Smith",
          age: 30,
          matchPercentage: "87%",
          lastSeen: "2024-03-10",
          location: "Delhi",
          image: "/api/placeholder/400/400"
        }
      ]);
    } catch (error) {
      console.error('Search error:', error);
      setError(t('search.by_face.search_error'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview); // Clean up the URL object
    }
    setPhoto(null);
    setPhotoPreview(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('search.by_face.page_title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('search.by_face.upload_notice')}
          </p>
        </div>

        {/* Main Search Section */}
        <Card className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-8">
              {/* Upload Section */}
              <div className="relative">
                <div className={`
                  border-2 border-dashed rounded-xl p-8
                  ${photoPreview ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                  transition-all duration-300 ease-in-out
                `}>
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-64 h-64 mx-auto rounded-lg object-cover shadow-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview(null);
                        }}
                      >
                        {t('search.by_face.remove_photo')}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('search.by_face.upload_button')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {t('search.by_face.file_requirements')}
                        </p>
                        <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          {t('search.by_face.upload_button')}
                          <Input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handlePhotoChange}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('search.by_face.gender_label')}
                </label>
                <Select onValueChange={setGender} value={gender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('search.by_face.select_gender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('search.by_face.gender_male')}</SelectItem>
                    <SelectItem value="female">{t('search.by_face.gender_female')}</SelectItem>
                    <SelectItem value="other">{t('search.by_face.gender_other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                disabled={isSearching || !photo}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('search.by_face.searching')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>{t('search.by_face.search_button')}</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t('search.by_face.results_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {searchResults.map((person) => (
                <Card key={person.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-full relative">
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                          {person.matchPercentage} {t('search.by_face.match')}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-bold mb-4">{person.name}</h3>
                      <div className="space-y-2 text-gray-600">
                        <p>{t('search.results.age')}: {person.age}</p>
                        <p>{t('search.results.last_seen')}: {person.lastSeen}</p>
                        <p>{t('search.results.location')}: {person.location}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full hover:bg-blue-50"
                      >
                        {t('search.results.view_details')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchByFace;