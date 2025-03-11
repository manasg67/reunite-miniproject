import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import 'ol/ol.css';

const MissingPersonsMap = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nearbyPersons, setNearbyPersons] = useState([]);
  const mapRef = useRef(null);
  const mapElement = useRef(null);
  const radius = 2;

  // Initialize map
  useEffect(() => {
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([72.8777, 19.0760]), // Default center (Mumbai)
        zoom: 12
      })
    });

    mapRef.current = map;

    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          console.log("Got user location:", latitude, longitude);
          
          // Update user location state
          setUserLocation({ lon: longitude, lat: latitude });
          
          // Center map on user location
          map.getView().setCenter(fromLonLat([longitude, latitude]));
          map.getView().setZoom(14);
          
          // Fetch nearby persons
          fetchNearbyPersons(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError("Unable to get your location. Please enable location services.");
          setLoading(false);
        }
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, []);

  const fetchNearbyPersons = async (latitude, longitude) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://192.168.0.101:8000/api/missing-persons/missing-persons/nearby/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby persons');
      }

      const data = await response.json();
      console.log("Fetched nearby persons:", data);
      setNearbyPersons(data);
      addMarkersToMap(data, { lat: latitude, lon: longitude });
    } catch (err) {
      console.error('Error fetching nearby persons:', err);
      setError('Failed to fetch nearby persons');
    }
  };

  const addMarkersToMap = (persons, userLoc) => {
    if (!mapRef.current) return;

    // Remove existing vector layers
    const layers = mapRef.current.getLayers();
    layers.forEach(layer => {
      if (layer instanceof VectorLayer) {
        mapRef.current.removeLayer(layer);
      }
    });

    const features = [];

    // Add user location marker
    const userFeature = new Feature({
      geometry: new Point(fromLonLat([userLoc.lon, userLoc.lat])),
      type: 'user'
    });

    userFeature.setStyle(new Style({
      image: new Icon({
        src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="8" fill="#3b82f6"/>
          </svg>
        `),
        scale: 1
      })
    }));

    features.push(userFeature);

    // Add missing persons markers
    persons.forEach(person => {
      if (person.last_known_latitude && person.last_known_longitude) {
        const personFeature = new Feature({
          geometry: new Point(fromLonLat([
            parseFloat(person.last_known_longitude),
            parseFloat(person.last_known_latitude)
          ])),
          properties: person,
          type: 'missing_person'
        });

        personFeature.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 0C7 0 3 4 3 9c0 6.2 9 15 9 15s9-8.8 9-15c0-5-4-9-9-9z" fill="#ef4444"/>
              </svg>
            `),
            scale: 1.2,
            anchor: [0.5, 1]
          })
        }));

        features.push(personFeature);
      }
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features
      })
    });

    mapRef.current.addLayer(vectorLayer);

    // Add click handler
    const clickHandler = (event) => {
      const feature = mapRef.current.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
        {
          hitTolerance: 5
        }
      );

      if (feature && feature.get('type') === 'missing_person') {
        const personData = feature.get('properties');
        console.log('Clicked person:', personData);
        setSelectedPerson(personData);
        setIsOpen(true);
      }
    };

    // Add pointer cursor on hover
    const pointerMoveHandler = (event) => {
      const pixel = mapRef.current.getEventPixel(event.originalEvent);
      const hit = mapRef.current.hasFeatureAtPixel(pixel, {
        hitTolerance: 5,
        layerFilter: (layer) => layer === vectorLayer
      });
      
      mapRef.current.getTarget().style.cursor = hit ? 'pointer' : '';
    };

    // Remove old listeners before adding new ones
    mapRef.current.un('click', clickHandler);
    mapRef.current.un('pointermove', pointerMoveHandler);

    // Add new listeners
    mapRef.current.on('click', clickHandler);
    mapRef.current.on('pointermove', pointerMoveHandler);

    return () => {
      if (mapRef.current) {
        mapRef.current.un('click', clickHandler);
        mapRef.current.un('pointermove', pointerMoveHandler);
      }
    };
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div 
        ref={mapElement} 
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
      
      <Button
        className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700"
        onClick={() => userLocation && fetchNearbyPersons(userLocation.lat, userLocation.lon)}
      >
        Refresh Nearby Cases
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          {selectedPerson && (
            <div className="p-4">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold mb-4">Missing Person Details</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-4">
                {selectedPerson.recent_photo && (
                  <div className="relative w-full max-w-sm mx-auto">
                    <img
                      src={selectedPerson.recent_photo}
                      alt={selectedPerson.name}
                      className="w-full rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg';
                      }}
                    />
                  </div>
                )}
                
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-primary">{selectedPerson.name}</h3>
                    <p className="text-sm text-gray-500">Case Number: {selectedPerson.case_number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Age</p>
                      <p className="text-sm">{selectedPerson.age_when_missing} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="text-sm">{selectedPerson.gender}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Seen</p>
                    <p className="text-sm">{new Date(selectedPerson.last_seen_date).toLocaleDateString()}</p>
                    <p className="text-sm">{selectedPerson.last_seen_location}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Physical Description</p>
                    <p className="text-sm">Height: {selectedPerson.height} cm</p>
                    <p className="text-sm">Weight: {selectedPerson.weight} kg</p>
                    <p className="text-sm">Identifying Marks: {selectedPerson.identifying_marks}</p>
                  </div>

                  {selectedPerson.last_seen_details && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Seen Details</p>
                      <p className="text-sm">{selectedPerson.last_seen_details}</p>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                    <p className="text-sm">{selectedPerson.emergency_contact_name} ({selectedPerson.emergency_contact_relation})</p>
                    <p className="text-sm">{selectedPerson.emergency_contact_phone}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm font-semibold text-red-600">{selectedPerson.status}</p>
                    <p className="text-sm text-gray-500 mt-1">Distance: {selectedPerson.distance}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MissingPersonsMap;