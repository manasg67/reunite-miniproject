import React, { useState } from 'react';
import { Search, Filter, Edit, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Mock data for cases
const mockCases = [
  {
    id: 1,
    name: "John Doe",
    caseNumber: "MP001",
    status: "Open",
    lastUpdated: "2023-06-15",
    assignedTo: "Detective Smith",
  },
  {
    id: 2,
    name: "Jane Smith",
    caseNumber: "MP002",
    status: "Closed",
    lastUpdated: "2023-05-20",
    assignedTo: "Detective Johnson",
  },
  {
    id: 3,
    name: "Mike Johnson",
    caseNumber: "MP003",
    status: "Under Investigation",
    lastUpdated: "2023-06-10",
    assignedTo: "Detective Williams",
  },
  {
    id: 4,
    name: "Emily Brown",
    caseNumber: "MP004",
    status: "Open",
    lastUpdated: "2023-06-18",
    assignedTo: "Detective Davis",
  },
  {
    id: 5,
    name: "Alex Wilson",
    caseNumber: "MP005",
    status: "Closed",
    lastUpdated: "2023-04-30",
    assignedTo: "Detective Moore",
  },
];

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-[425px] w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const CaseManagement = () => {
  const [cases, setCases] = useState(mockCases);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleFilter = () => {
    const filtered = mockCases.filter(
      (case_) =>
        case_.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (statusFilter === "" || case_.status === statusFilter)
    );
    setCases(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "Closed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Under Investigation":
        return <Search className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleEditCase = (case_) => {
    setSelectedCase(case_);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Case Management</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8" style={{ borderRadius: '4px' }}>
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Filter Cases</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Filter by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            style={{ borderRadius: '4px' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-[180px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            style={{ borderRadius: '4px' }}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Under Investigation">Under Investigation</option>
          </select>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200 flex items-center"
            style={{ borderRadius: '4px' }}
          >
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ borderRadius: '4px' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{case_.caseNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{case_.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(case_.status)}
                      <span className="ml-2">{case_.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{case_.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{case_.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEditCase(case_)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Edit Case: {selectedCase?.caseNumber}
        </h2>
        <p className="text-sm text-gray-500 mb-4">Update case details here.</p>
        {/* Add form fields for editing case details */}
      </Modal>
    </div>
  );
};

export default CaseManagement;