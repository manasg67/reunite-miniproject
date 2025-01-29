import React, { useState } from 'react';
import { Search, User, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Anupama from '../../assets/sample.jpg'

// Mock data remains the same
const mockMissingPersons = [
  { id: 1, name: "john deo", photo: Anupama, caseNumber: "MP001", area: "Downtown" },
  { id: 2, name: "Jane Smith", photo: Anupama, caseNumber: "MP002", area: "Suburb" },

  { id: 3, name: "Mike Johnson", photo: Anupama, caseNumber: "MP003", area: "Rural" },
  { id: 4, name: "Emily Brown", photo: Anupama, caseNumber: "MP004", area: "City Center" },

  { id: 5, name: "Alex Wilson", photo: Anupama, caseNumber: "MP005", area: "Coastal" },
  { id: 6, name: "Sarah Lee", photo: Anupama, caseNumber: "MP006", area: "Mountain" }
];


const PersonCard = ({ person, onViewDetails }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative">
      <img src={person.photo || Anupama} alt={person.name} className="w-full h-56 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-xl font-bold text-white">{person.name}</h3>
      </div>

    </div>
    <div className="p-5 space-y-3">
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          {person.caseNumber}
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {person.area}
        </span>
      </div>
      <button 
        onClick={() => onViewDetails(person.id)}
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
      >
        View Details
      </button>
    </div>
  </div>
);

const FilterSection = ({ nameFilter, caseNumberFilter, areaFilter, setNameFilter, setCaseNumberFilter, setAreaFilter, handleFilter }) => (
  <div className="bg-white rounded-2xl shadow-xl mb-8 p-8 backdrop-blur-lg bg-white/90">
    <div className="mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Filter Missing Persons
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Filter by case number"
          value={caseNumberFilter}
          onChange={(e) => setCaseNumberFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Filter by area"
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
        <Filter className="mr-2 h-5 w-5" /> Apply Filters
      </button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [filteredPersons, setFilteredPersons] = useState(mockMissingPersons);
  const [nameFilter, setNameFilter] = useState("");
  const [caseNumberFilter, setCaseNumberFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  const handleFilter = () => {
    const filtered = mockMissingPersons.filter(
      (person) =>
        person.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        person.caseNumber.toLowerCase().includes(caseNumberFilter.toLowerCase()) &&
        person.area.toLowerCase().includes(areaFilter.toLowerCase())
    );
    setFilteredPersons(filtered);
  };

  const handleViewDetails = () => {
    navigate('/missing-person');
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white shadow-lg backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Missing Persons Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Welcome, Admin</span>
              <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <FilterSection
          nameFilter={nameFilter}
          caseNumberFilter={caseNumberFilter}
          areaFilter={areaFilter}
          setNameFilter={setNameFilter}
          setCaseNumberFilter={setCaseNumberFilter}
          setAreaFilter={setAreaFilter}
          handleFilter={handleFilter}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPersons.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredPersons.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 font-medium">No matching records found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;