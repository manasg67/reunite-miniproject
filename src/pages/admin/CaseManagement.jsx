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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-[425px] w-full relative border border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
        <div className="p-8">
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
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "Closed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "Under Investigation":
        return <Search className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Closed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Under Investigation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEditCase = (case_) => {
    setSelectedCase(case_);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 text-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">Case Management</h1>
        <p className="text-black mb-8">Track and manage missing person cases efficiently</p>



        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-black">
          <h2 className="text-xl font-semibold text-black mb-6">Filter Cases</h2>
          <div className="flex flex-wrap gap-4">
            <input

              type="text"

              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="flex-grow px-6 py-3 bg-white/10 border border-black rounded-xl text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}

              className="w-[180px] px-6 py-3 bg-white/10 border border-black rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="" className="text-black">All Statuses</option>

              <option value="Open" className="text-black">Open</option>
              <option value="Closed" className="text-black">Closed</option>
              <option value="Under Investigation" className="text-black">Under Investigation</option>

            </select>
            <button
              onClick={handleFilter}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-black rounded-xl transition-all duration-200 flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Filter className="h-4 w-4" /> Apply Filters
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-black">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>

                <tr className="bg-black/20">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Case Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>

                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Last Updated</th>

                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {cases.map((case_) => (
                  <tr key={case_.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-black">{case_.caseNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-black">{case_.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">

                        {getStatusIcon(case_.status)}
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusStyle(case_.status)}`}>
                          {case_.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-black/80">{case_.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-black/80">{case_.assignedTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button

                        onClick={() => handleEditCase(case_)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-black rounded-xl text-black transition-all duration-200 inline-flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">
            Edit Case: {selectedCase?.caseNumber}
          </h2>
          <p className="text-black">Update case details here.</p>
          <div className="space-y-4 mt-6">

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Status"
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Assigned To"
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="date"
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CaseManagement;