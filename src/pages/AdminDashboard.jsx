import React, { useState } from 'react';
import { Search, User, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for missing persons
const mockMissingPersons = [
  { id: 1, name: "John Doe", photo: "/placeholder.svg?height=100&width=100", caseNumber: "MP001", area: "Downtown" },
  { id: 2, name: "Jane Smith", photo: "/placeholder.svg?height=100&width=100", caseNumber: "MP002", area: "Suburb" },
  { id: 3, name: "Mike Johnson", photo: "/placeholder.svg?height=100&width=100", caseNumber: "MP003", area: "Rural" },
  { id: 4, name: "Emily Brown", photo: "/placeholder.svg?height=100&width=100", caseNumber: "MP004", area: "City Center" },
  { id: 5, name: "Alex Wilson", photo: "/placeholder.svg?height=100&width=100", caseNumber: "MP005", area: "Coastal" },
  { id: 6, name: "Sarah Lee", photo: "/placeholder.svg?height=100&width=100", caseNumber: "MP006", area: "Mountain" }
];

const PersonCard = ({ person, onViewDetails }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
    <div className="p-0">
      <img src={person.photo || "/placeholder.svg"} alt={person.name} className="w-full h-48 object-cover" />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-indigo-700">{person.name}</h3>
      <p className="text-sm text-gray-600">Case: {person.caseNumber}</p>
      <p className="text-sm text-gray-600">Area: {person.area}</p>
    </div>
    <div className="px-4 pb-4">
      <button 
        onClick={() => onViewDetails(person.id)}
        className="w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors duration-200"
      >
        View Details
      </button>
    </div>
  </div>
);

const FilterSection = ({ nameFilter, caseNumberFilter, areaFilter, setNameFilter, setCaseNumberFilter, setAreaFilter, handleFilter }) => (
  <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-indigo-700">Filter Missing Persons</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="Filter by name"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <input
        type="text"
        placeholder="Filter by case number"
        value={caseNumberFilter}
        onChange={(e) => setCaseNumberFilter(e.target.value)}
        className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <input
        type="text"
        placeholder="Filter by area"
        value={areaFilter}
        onChange={(e) => setAreaFilter(e.target.value)}
        className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
    <div className="mt-4">
      <button
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 flex items-center justify-center"
        onClick={handleFilter}
      >
        <Filter className="mr-2 h-4 w-4" /> Apply Filters
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-700">Missing Persons Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, Admin</span>
            <User className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <FilterSection
          nameFilter={nameFilter}
          caseNumberFilter={caseNumberFilter}
          areaFilter={areaFilter}
          setNameFilter={setNameFilter}
          setCaseNumberFilter={setCaseNumberFilter}
          setAreaFilter={setAreaFilter}
          handleFilter={handleFilter}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPersons.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredPersons.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No matching records found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;