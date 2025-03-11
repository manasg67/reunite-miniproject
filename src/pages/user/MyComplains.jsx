import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Phone, User, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MissingPersonsPage = () => {
  const navigate = useNavigate();
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }
        
        const response = await axios.get('http://127.0.0.1:8000/api/missing-persons/missing-persons/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        setMissingPersons(response.data);
      } catch (err) {
        setError(err.message);
        if (err.message === 'No access token found') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Missing Persons Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missingPersons.map((person) => (
          <Card key={person.case_number} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{person.name}</h2>
                  <p className="text-sm text-gray-500">Case #{person.case_number}</p>
                </div>
                <div className="px-2 py-1 rounded bg-red-100 text-red-800 text-sm">
                  {person.status}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{person.age_when_missing} years old, {person.gender}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{person.last_seen_location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Last seen: {formatDate(person.last_seen_date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>Emergency Contact: {person.emergency_contact_phone}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Last Seen Details:</h3>
                <p className="text-sm text-gray-600">{person.last_seen_details}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline">Contact</Button>
              <Button onClick={() => navigate(`/create-poster/${person.id}`)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {missingPersons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No missing person reports found.</p>
        </div>
      )}
    </div>
  );
};

export default MissingPersonsPage;