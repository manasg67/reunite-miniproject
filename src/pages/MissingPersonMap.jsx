import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MapPin, Loader2, UserCircle } from 'lucide-react';

// Dummy data - in real app, this would be filtered on the server based on location
const missingPersonsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 12,
    lastSeen: "2025-01-28",
    location: { lon: -118.2437, lat: 34.0522 },
    description: "Last seen wearing blue jeans and red t-shirt",
    contact: "Detective Smith: 555-0123",
    image: "/api/placeholder/150/200"
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 15,
    lastSeen: "2025-01-29",
    location: { lon: -118.2537, lat: 34.0622 },
    description: "Last seen near Central Park wearing school uniform",
    contact: "Detective Johnson: 555-0124",
    image: "/api/placeholder/150/200"
  },
  {
    id: 3,
    name: "Emma Davis",
    age: 9,
    lastSeen: "2025-01-30",
    location: { lon: -118.2337, lat: 34.0422 },
    description: "Last seen at downtown playground",
    contact: "Detective Brown: 555-0125",
    image: "/api/placeholder/150/200"
  }
];

const MissingPersonsMap = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();
  const mapElement = useRef();

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation({ lon: longitude, lat: latitude });
          setLoading(false);
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  // Create and set up map
  useEffect(() => {
    if (loading || !userLocation) return;

    // Convert SVG icons to data URLs for OpenLayers
    const createSVGIcon = (Icon, color) => {
      const svg = `
      
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          ${Icon}
          <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="1"/>
        </svg>
      `;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    // Create vector features
    const features = missingPersonsData.map(person => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([person.location.lon, person.location.lat])),
        properties: person
      });
      
      feature.setStyle(new Style({
        image: new Icon({
          src: createSVGIcon(MapPin, '#ef4444'),
          scale: 1,
          anchor: [0.5, 1]
        })
      }));
      
      return feature;
    });

    // Add user location feature
    const userFeature = new Feature({
      geometry: new Point(fromLonLat([userLocation.lon, userLocation.lat]))
    });
    
    userFeature.setStyle(new Style({
      image: new Icon({
        src: createSVGIcon(UserCircle, '#3b82f6'),
        scale: 1,
        anchor: [0.5, 0.5]
      })
    }));
    
    features.push(userFeature);

    // Create vector source and layer
    const vectorSource = new VectorSource({ features });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    // Create map
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([userLocation.lon, userLocation.lat]),
        zoom: 13
      })
    });

    // Add click handler
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
      if (feature && feature.get('properties')) {
        setSelectedPerson(feature.get('properties'));
        setIsOpen(true);
      }
    });

    // Add hover effect
    map.on('pointermove', (e) => {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [loading, userLocation]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Getting your location...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white">
      <div 
        ref={mapElement} 
        className="w-full h-full"
        style={{ background: '#f8f9fa' }}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          {selectedPerson && (
            <div className="space-y-4">
              <SheetHeader>
                <SheetTitle>Missing Person Details</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-4">
                <img
                  src={selectedPerson.image}
                  alt={selectedPerson.name}
                  className="w-full max-w-sm rounded-lg shadow-md"
                />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{selectedPerson.name}</h3>
                  <p className="text-gray-600">Age: {selectedPerson.age}</p>
                  <p className="text-gray-600">Last Seen: {selectedPerson.lastSeen}</p>
                  <p className="text-gray-600">Description: {selectedPerson.description}</p>
                  <p className="text-gray-600">Contact: {selectedPerson.contact}</p>
                  <p className="text-gray-600">
                    Location: {selectedPerson.location.lat.toFixed(4)}, {selectedPerson.location.lon.toFixed(4)}
                  </p>
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