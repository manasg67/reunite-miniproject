import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, User, AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Anupama from '../../assets/sample.jpg'

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-[425px] w-full relative shadow-2xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

const FamilyMemberCard = ({ member, onContact, t }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="p-6">
      <div className="relative">
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
          {member.relation}
        </div>
      </div>
    </div>
    <div className="px-6 pb-6 text-center">
      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {member.name}
      </h3>
      <p className="text-gray-600 mt-2">{member.phone}</p>
      <button
        onClick={() => onContact(member)}
        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {t('missing_person_details.contact')}
      </button>
    </div>
  </div>
);

const ContactModal = ({ member, isOpen, onClose }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, I'm from the admin team.",
      sender: "admin"
    },
    {
      id: 2,
      text: "Hi, thank you for reaching out. Any updates about my family member?",
      sender: "user"
    },
    {
      id: 3,
      text: "We're actively investigating. I'll keep you updated.",
      sender: "admin"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "admin",
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <img
          src={member?.photo || Anupama}
          alt={member?.name}
          className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-100 ring-4 ring-indigo-50 mb-4"
        />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {member?.name}
        </h2>
        <p className="text-gray-600">Contact information for {member?.relation}</p>
      </div>
      <div className="space-y-4">
        <a href={`tel:${member?.phone}`} className="flex items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200">
          <Phone className="h-6 w-6 mr-4 text-indigo-600" />
          <span className="text-gray-700 font-medium">{member?.phone}</span>
        </a>
        <button 
          onClick={() => setIsChatOpen(true)} 
          className="w-full flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200"
        >
          <Mail className="h-6 w-6 mr-4 text-purple-600" />
          <span className="text-gray-700 font-medium">Open Chat</span>
        </button>
      </div>

      {/* Chat Modal */}
      <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <div className="w-full max-w-lg">
          <div className="flex items-center border-b pb-4 mb-4">
            <img
              src={member?.photo || Anupama}
              alt={member?.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-bold text-lg">{member?.name}</h3>
              <p className="text-sm text-gray-600">{member?.relation}</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-[70%] ${
                    message.sender === 'admin' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </Modal>
    </Modal>
  );
};

const FoundModal = ({ isOpen, onClose, t }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-green-600 mb-2">{t('missing_person_details.thank_you')}</h2>
      <p className="text-gray-600">{t('missing_person_details.report_received')}</p>
    </div>
    <div className="bg-green-50 rounded-xl p-6">
      <div className="flex items-start">
        <div>
          <h3 className="text-green-800 font-bold text-lg">{t('missing_person_details.important_info')}</h3>
          <p className="text-green-700 mt-2 leading-relaxed">
            {t('missing_person_details.contact_message')}
          </p>
        </div>
      </div>
    </div>
  </Modal>
);

const MissingPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [missingPerson, setMissingPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchMissingPersonDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://192.168.0.101:8000/api/missing-persons/missing-persons/${id}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        });

        if (response.status === 404) {
          throw new Error('Person not found');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch missing person details');
        }

        const data = await response.json();
        setMissingPerson(data);
        
      } catch (err) {
        console.error('Error fetching details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMissingPersonDetails();
    }
  }, [id, navigate]);

  const handleContactMember = (member) => {
    setSelectedContact(member);
    setIsContactModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !missingPerson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error || 'Person not found'}</div>
      </div>
    );
  }

  // Create contact objects for emergency and secondary contacts
  const contacts = [
    {
      id: 1,
      name: missingPerson.emergency_contact_name,
      relation: missingPerson.emergency_contact_relation,
      phone: missingPerson.emergency_contact_phone,
    },
    {
      id: 2,
      name: missingPerson.secondary_contact_name,
      relation: "Secondary Contact",
      phone: missingPerson.secondary_contact_phone,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 p-8 mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg bg-white/90">
        <div className="md:flex">
          <div className="md:flex-shrink-0 relative">
            <img
              src={missingPerson.recent_photo}
              alt={missingPerson.name}
              className="h-full w-full object-cover md:w-80"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
              <span className="text-sm font-medium text-indigo-600">
                {t('missing_person_details.case_number')} {missingPerson.case_number}
              </span>
            </div>
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {missingPerson.name}
            </h1>
            <div className="mt-6 space-y-4">
              <div className="flex items-center p-3 bg-indigo-50 rounded-xl">
                <User className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="text-gray-700 font-medium">
                  {t('missing_person_details.age')}: {missingPerson.age_when_missing}
                </span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                <MapPin className="h-5 w-5 mr-3 text-purple-600" />
                <span className="text-gray-700 font-medium">
                  {t('missing_person_details.last_seen')}: {missingPerson.last_seen_location}
                </span>
              </div>
              <div className="flex items-center p-3 bg-indigo-50 rounded-xl">
                <Calendar className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="text-gray-700 font-medium">
                  {t('missing_person_details.date')}: {new Date(missingPerson.last_seen_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="mt-6 text-gray-600 leading-relaxed">{missingPerson.last_seen_details}</p>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            {t('missing_person_details.contact_info')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contacts.map((contact) => (
              <FamilyMemberCard
                key={contact.id}
                member={contact}
                onContact={handleContactMember}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>

      <ContactModal
        member={selectedContact}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        t={t}
      />
    </div>
  );
};

export default MissingPersonDetails;