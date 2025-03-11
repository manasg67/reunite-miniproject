import React, { useState, useEffect } from 'react';
import { Search, User, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PersonCard = ({ person, onViewDetails, t }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative">
      <img 
        src={person.recent_photo} 
        alt={person.name} 
        className="w-full h-56 object-cover" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'fallback-image-url.jpg'; // Add a fallback image URL
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-xl font-bold text-white">{person.name}</h3>
      </div>
    </div>
    <div className="p-5 space-y-3">
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          {person.case_number}
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {person.last_seen_location}
        </span>
      </div>
      <button 
        onClick={() => onViewDetails(person.id)}
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
      >
        {t('admin_dashboard.view_details')}
      </button>
    </div>
  </div>
);

const FilterSection = ({ nameFilter, caseNumberFilter, areaFilter, setNameFilter, setCaseNumberFilter, setAreaFilter, handleFilter, t }) => (
  <div className="bg-white rounded-2xl shadow-xl mb-8 p-8 backdrop-blur-lg bg-white/90">
    <div className="mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {t('admin_dashboard.filter_title')}
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={t('admin_dashboard.filter_by_name')}
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={t('admin_dashboard.filter_by_case')}
          value={caseNumberFilter}
          onChange={(e) => setCaseNumberFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={t('admin_dashboard.filter_by_area')}
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
    <div className="mt-6">
      <button
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg"
        onClick={handleFilter}
      >
        <Filter className="mr-2 h-5 w-5" /> {t('admin_dashboard.apply_filters')}
      </button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [missingPersons, setMissingPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [caseNumberFilter, setCaseNumberFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  useEffect(() => {
    const fetchMissingPersons = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://192.168.0.101:8000/api/missing-persons/missing-persons/search/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch missing persons');
        }

        const data = await response.json();
        setMissingPersons(data);
        setFilteredPersons(data);
      } catch (err) {
        console.error('Error fetching missing persons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, [navigate]);

  const handleFilter = () => {
    const filtered = missingPersons.filter(
      (person) =>
        person.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        person.case_number.toLowerCase().includes(caseNumberFilter.toLowerCase()) &&
        person.last_seen_location.toLowerCase().includes(areaFilter.toLowerCase())
    );
    setFilteredPersons(filtered);
  };

  const handleViewDetails = (id) => {
    navigate(`/missing-person/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 mt-16">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <FilterSection
          nameFilter={nameFilter}
          caseNumberFilter={caseNumberFilter}
          areaFilter={areaFilter}
          setNameFilter={setNameFilter}
          setCaseNumberFilter={setCaseNumberFilter}
          setAreaFilter={setAreaFilter}
          handleFilter={handleFilter}
          t={t}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPersons.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              onViewDetails={handleViewDetails}
              t={t}
            />
          ))}
        </div>

        {filteredPersons.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 font-medium">{t('admin_dashboard.no_records')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;