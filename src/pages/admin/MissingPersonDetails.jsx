import React, { useState } from 'react';
import { Phone, Mail, MapPin, Calendar, User, AlertTriangle, X } from 'lucide-react';
import Anupama from '../../assets/sample.jpg'

// Mock data remains the same
const missingPerson = {
  id: 1,
  name: "John Doe",
  photo: Anupama,
  age: 30,
  lastSeen: "2023-06-15",
  lastLocation: "Central Park, New York",
  description: "John was last seen wearing a blue t-shirt and jeans. He has a distinctive tattoo on his right arm.",
  caseNumber: "MP001",
  familyMembers: [
    {
      id: 1,
      name: "Jane Doe",
      relation: "Wife",
      photo: Anupama,
      phone: "+1234567890",
      email: "jane@example.com",

    },
    {
      id: 2,
      name: "Mike Doe",
      relation: "Brother",
      photo: Anupama,
      phone: "+1987654321",
      email: "mike@example.com",

    },
    {
      id: 3,
      name: "Sarah Doe",
      relation: "Sister",
      photo: Anupama,
      phone: "+1122334455",
      email: "sarah@example.com",

    },
  ],
};

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

const FamilyMemberCard = ({ member, onContact }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="p-6">
      <div className="relative">
        <img
          src={member.photo || Anupama}
          alt={member.name}
          width={100}
          height={100}
          className="rounded-full mx-auto border-4 border-indigo-100 ring-4 ring-indigo-50"
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
          {member.relation}
        </div>
      </div>
    </div>
    <div className="px-6 pb-6 text-center">
      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {member.name}
      </h3>
      <button
        onClick={() => onContact(member)}
        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Contact
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

const FoundModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h2>
      <p className="text-gray-600">Your report has been received</p>
    </div>
    <div className="bg-green-50 rounded-xl p-6">
      <div className="flex items-start">
        <div>
          <h3 className="text-green-800 font-bold text-lg">Important Information</h3>
          <p className="text-green-700 mt-2 leading-relaxed">
            You will be contacted by their family member shortly, or you can contact them using the information
            provided above.
          </p>
        </div>
      </div>
    </div>
  </Modal>
);

const MissingPersonDetails = () => {
  const [isPersonFound, setIsPersonFound] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFoundModalOpen, setIsFoundModalOpen] = useState(false);

  const handlePersonFound = () => {
    setIsPersonFound(true);
    setIsFoundModalOpen(true);
  };

  const handleContactMember = (member) => {
    setSelectedFamilyMember(member);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg bg-white/90">
        <div className="md:flex">
          <div className="md:flex-shrink-0 relative">
            <img
              src={missingPerson.photo || "/placeholder.svg"}
              alt={missingPerson.name}
              width={300}
              height={300}
              className="h-full w-full object-cover md:w-80"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
              <span className="text-sm font-medium text-indigo-600">Case #{missingPerson.caseNumber}</span>
            </div>
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {missingPerson.name}
            </h1>
            <div className="mt-6 space-y-4">
              <div className="flex items-center p-3 bg-indigo-50 rounded-xl">
                <User className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="text-gray-700 font-medium">Age: {missingPerson.age}</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                <MapPin className="h-5 w-5 mr-3 text-purple-600" />
                <span className="text-gray-700 font-medium">Last seen: {missingPerson.lastLocation}</span>
              </div>
              <div className="flex items-center p-3 bg-indigo-50 rounded-xl">
                <Calendar className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="text-gray-700 font-medium">Date: {missingPerson.lastSeen}</span>
              </div>
            </div>
            <p className="mt-6 text-gray-600 leading-relaxed">{missingPerson.description}</p>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Family Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missingPerson.familyMembers.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onContact={handleContactMember}
              />
            ))}
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-white to-gray-50">
          <button
            onClick={handlePersonFound}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Report Person Found
          </button>
        </div>
      </div>

      <ContactModal
        member={selectedFamilyMember}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <FoundModal
        isOpen={isFoundModalOpen}
        onClose={() => setIsFoundModalOpen(false)}
      />
    </div>
  );
};

export default MissingPersonDetails;