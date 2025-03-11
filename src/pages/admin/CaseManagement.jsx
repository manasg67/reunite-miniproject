import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CaseManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/missing-persons/missing-persons/search/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cases');
        }

        const data = await response.json();
        setCases(data);
        setFilteredCases(data);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'MISSING':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'FOUND':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'INVESTIGATING':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'CLOSED':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'MISSING':
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 'FOUND':
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case 'INVESTIGATING':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'CLOSED':
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleFilter = () => {
    const filtered = cases.filter((case_) => {
      const nameMatch = case_.name.toLowerCase().includes(nameFilter.toLowerCase());
      const statusMatch = statusFilter === "" || case_.status === statusFilter;
      return nameMatch && statusMatch;
    });
    setFilteredCases(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [nameFilter, statusFilter]); // Auto-filter when inputs change

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdateLoading(true);
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/missing-persons/missing-persons/${id}/update_status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update the local state to reflect the change
      const updatedCases = cases.map(case_ => 
        case_.id === id ? { ...case_, status: newStatus } : case_
      );
      setCases(updatedCases);
      setFilteredCases(updatedCases);

    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 text-black p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
          {t('case_management.title')}
        </h1>
        <p className="text-black mb-8">{t('case_management.subtitle')}</p>

        {/* Search and Filter Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/10 backdrop-blur-md rounded-xl border border-black text-black placeholder-black/60"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/60" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-black text-black appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="MISSING">Missing</option>
              <option value="FOUND">Found</option>
              <option value="INVESTIGATING">Under Investigation</option>
              <option value="CLOSED">Case Closed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/60" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-black">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    {t('case_management.table.case_number')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    {t('case_management.table.name')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    {t('case_management.table.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    {t('case_management.table.last_seen')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    {t('case_management.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredCases.map((case_) => (
                  <tr key={case_.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-black">{case_.case_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-black">{case_.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(case_.status)}
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusStyle(case_.status)}`}>
                          {case_.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-black">{case_.last_seen_location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        onChange={(e) => handleStatusUpdate(case_.id, e.target.value)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-black rounded-xl text-black transition-all duration-200"
                        disabled={updateLoading}
                        value={case_.status}
                      >
                        <option value="MISSING">Missing</option>
                        <option value="FOUND">Found</option>
                        <option value="INVESTIGATING">Under Investigation</option>
                        <option value="CLOSED">Case Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseManagement;