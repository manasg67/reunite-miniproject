import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Calendar, MapPin, User } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';

const SearchByName = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    setSearchResults([]);

    if (!searchQuery.trim()) {
      setError(t('search.by_name.empty_query'));
      setIsSearching(false);
      return;
    }
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/api/missing-persons/missing-persons/search/?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data);
      
      if (data.length === 0) {
        setError(t('search.no_results'));
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(t('search.error'));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            {t('search.by_name.page_title')}
          </h1>
          <p className="text-blue-200 text-center text-lg max-w-2xl mx-auto">
            {t('search.by_name.description')}
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {t('search.by_name.help_text')}
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder={t('search.by_name.input_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow text-lg py-6"
              />
              <Button 
                type="submit" 
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto"
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('search.searching')}</span>
                  </div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    {t('search.by_name.search_button')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="mt-12 mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              {t('search.results.heading')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((person) => (
                <Card key={person.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src={person.recent_photo}
                    alt={person.name}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/fallback-image.jpg'; // Add a fallback image
                    }}
                  />
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-gray-900">{person.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>{t('search.results.age')}: {person.age_when_missing}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{t('search.results.last_seen')}: {new Date(person.last_seen_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{t('search.results.location')}: {person.last_seen_location}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(`/missing-person/${person.id}`)}
                      variant="outline" 
                      className="mt-6 w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      {t('search.results.view_details')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchByName;