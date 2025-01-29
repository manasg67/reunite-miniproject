import React, { useState } from 'react';
import { Phone, Mail, MapPin, Calendar, User, AlertTriangle } from 'lucide-react';

// Mock data for the missing person
const missingPerson = {
  id: 1,
  name: "John Doe",
  photo: "/placeholder.svg?height=300&width=300",
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
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+1234567890",
      email: "jane@example.com",
    },
    {
      id: 2,
      name: "Mike Doe",
      relation: "Brother",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+1987654321",
      email: "mike@example.com",
    },
    {
      id: 3,
      name: "Sarah Doe",
      relation: "Sister",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+1122334455",
      email: "sarah@example.com",
    },
  ],
};

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

const FamilyMemberCard = ({ member, onContact }) => (
  <div className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-300">
    <div className="p-4">
      <img
        src={member.photo || "/placeholder.svg"}
        alt={member.name}
        width={100}
        height={100}
        className="rounded-full mx-auto border-4 border-indigo-100"
      />
    </div>
    <div className="p-4 text-center">
      <h3 className="text-lg font-semibold text-indigo-700">{member.name}</h3>
      <p className="text-sm text-gray-600">{member.relation}</p>
      <button
        onClick={() => onContact(member)}
        className="mt-4 w-full px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors duration-200"
      >
        Contact
      </button>
    </div>
  </div>
);

const ContactModal = ({ member, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-2xl text-indigo-700 mb-2">{member?.name}</h2>
    <p className="text-gray-600 mb-6">Contact information for {member?.relation}</p>
    <div className="space-y-4">
      <div className="flex items-center">
        <Phone className="h-5 w-5 mr-3 text-indigo-500" />
        <span className="text-gray-700">{member?.phone}</span>
      </div>
      <div className="flex items-center">
        <Mail className="h-5 w-5 mr-3 text-indigo-500" />
        <span className="text-gray-700">{member?.email}</span>
      </div>
    </div>
  </Modal>
);

const FoundModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-2xl text-green-700 mb-2">Thank You!</h2>
    <p className="text-gray-600 mb-6">Your report has been received</p>
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-green-600 mt-1 mr-2" />
        <div>
          <h3 className="text-green-800 font-semibold">Important Information</h3>
          <p className="text-green-700 mt-1">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={missingPerson.photo || "/placeholder.svg"}
              alt={missingPerson.name}
              width={300}
              height={300}
              className="h-full w-full object-cover md:w-64"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
              Case #{missingPerson.caseNumber}
            </div>
            <h1 className="mt-1 text-4xl font-bold text-gray-900">{missingPerson.name}</h1>
            <div className="mt-4 flex items-center text-gray-700">
              <User className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Age: {missingPerson.age}</span>
            </div>
            <div className="mt-2 flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Last seen: {missingPerson.lastLocation}</span>
            </div>
            <div className="mt-2 flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Date: {missingPerson.lastSeen}</span>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{missingPerson.description}</p>
          </div>
        </div>

        <div className="p-8 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Family Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missingPerson.familyMembers.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onContact={handleContactMember}
              />
            ))}
          </div>
        </div>

        <div className="p-8 bg-gray-100">
          <button
            onClick={handlePersonFound}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300"
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