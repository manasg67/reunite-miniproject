import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Heart, Shield, Clock, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

const SearchByAadhaar = () => {
  const { t } = useTranslation();
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const validateAadhaar = (number) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(number);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateAadhaar(aadhaarNumber)) {
      setError(t('search.by_aadhaar.validation_error'));
      return;
    }

    setIsSearching(true);
    try {
      // Simulated API call
      setTimeout(() => {
        setSearchResults({
          id: 1,
          name: "John Doe",
          age: 25,
          aadhaarNumber: "XXXX-XXXX-" + aadhaarNumber.slice(-4),
          lastSeen: "2024-03-15",
          location: "Mumbai",
          additionalDetails: {
            height: "5'8\"",
            weight: "70 kg",
            identifying_marks: "Scar on left arm",
            last_seen_wearing: "Blue shirt and black pants"
          }
        });
        setIsSearching(false);
      }, 1500);
    } catch (error) {
      setError(t('search.by_aadhaar.search_error'));
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 mt-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {t('search.by_aadhaar.page_title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('home.hero.subtitle')}
        </p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="font-bold text-xl">10,000+</p>
              <p className="text-sm text-gray-600">{t('home.hero.stats.reunited')}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-bold text-xl">100%</p>
              <p className="text-sm text-gray-600">{t('home.hero.stats.secure')}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-bold text-xl">24hrs</p>
              <p className="text-sm text-gray-600">{t('success_stories.stats.response_time.label')}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-bold text-xl">98%</p>
              <p className="text-sm text-gray-600">{t('success_stories.stats.success_rate.label')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="backdrop-blur bg-white/90">
          <CardContent className="p-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
                {t('search.by_aadhaar.privacy_notice')}
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t('search.by_aadhaar.input_placeholder')}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={12}
                  className="w-full h-12 pl-4 pr-12 text-lg border-2 focus:border-blue-500"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  {aadhaarNumber.length}/12
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                {t('search.by_aadhaar.input_help')}
              </p>

              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                disabled={isSearching || aadhaarNumber.length !== 12}
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    {t('search.by_aadhaar.search_button')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="max-w-4xl mx-auto mt-8 animate-fadeIn">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="md:flex bg-white">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-purple-100 p-6">
                  <img
                    src="/api/placeholder/300/400"
                    alt={searchResults.name}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{searchResults.name}</h2>
                    <p className="text-gray-600">ID: {searchResults.aadhaarNumber}</p>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {t('search.results.basic_info')}
                      </h3>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-600">
                          <span className="w-24">{t('search.results.age')}:</span>
                          <span className="font-medium">{searchResults.age}</span>
                        </p>
                        <p className="flex items-center text-gray-600">
                          <span className="w-24">{t('search.results.last_seen')}:</span>
                          <span className="font-medium">{searchResults.lastSeen}</span>
                        </p>
                        <p className="flex items-center text-gray-600">
                          <span className="w-24">{t('search.results.location')}:</span>
                          <span className="font-medium">{searchResults.location}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {t('search.results.additional_info')}
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(searchResults.additionalDetails).map(([key, value]) => (
                          <p key={key} className="flex items-center text-gray-600">
                            <span className="w-32">{t(`search.results.${key}`)}:</span>
                            <span className="font-medium">{value}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="mt-6 w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                    {t('search.results.contact_family')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchByAadhaar;