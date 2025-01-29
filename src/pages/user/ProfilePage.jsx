
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/Modal"
import { Input } from "@/components/ui/input"

const Profile = () => {
  const user = {
    fullName: "John Doe",
    profilePhoto: "/images/john-doe.jpg",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    familyMembers: [
      { name: "Jane Doe", profilePhoto: "/images/jane-doe.jpg", relation: "Wife" },
      { name: "Jimmy Doe", profilePhoto: "/images/jimmy-doe.jpg", relation: "Son" },
      { name: "Jenny Doe", profilePhoto: "/images/jenny-doe.jpg", relation: "Daughter" },
    ],
  }

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [familyName, setFamilyName] = useState("")
  const [familyCode, setFamilyCode] = useState("")
  const [familyRelation, setFamilyRelation] = useState("")

    const handleCreateFamily = (e) => {
      e.preventDefault()
      console.log("Family Name:", familyName)
      // Add logic to handle family creation
    }
    const handleJoinFamily = (e) => {
      e.preventDefault()
      console.log("Family Name:", familyName)
      // Add logic to handle family creation
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center w-full justify-center px-2 sm:px-20 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 relative top-28 sm:top-20 rounded shadow-lg p-6 w-full "
      >
        <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {/* <Avatar className="w-32 h-32 border border-black">
              <AvatarImage src={user.profilePhoto} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar> */}
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="w-full h-full sm:w-96 sm:h-96 border border-black" />
            ) : (
              // <img src="/placeholder.svg" alt="Profile" className="w-full h-full sm:w-96 sm:h-96 border border-black" />
              <Avatar className="w-32 h-32 border border-black">
              {/* <AvatarImage src={user.profilePhoto} alt={user.fullName} /> */}
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar> 

            )}

            {/* <img src={user.profilePhoto} alt="Profile" className="w-full h-full sm:w-96 sm:h-96 border border-black" /> */}
          </motion.div>
          <div className="flex-1">
            <motion.h2
              className="sm:text-3xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user.fullName}
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ProfileItem label="Gender" value={user.gender} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Phone" value={user.phone} />
            </motion.div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2 text-center">Family Members</h3>
          <ul className=" grid grid-cols-1 sm:grid-cols-3 gap-10">
            {user.familyMembers.map((member, index) => (
              <li key={index} className="flex flex-col justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                {member.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="w-full h-full sm:w-64 sm:h-64 border rounded-full border-black" />
            ) : (
              // <img src="/placeholder.svg" alt="Profile" className="w-full h-full sm:w-96 sm:h-96 border border-black" />
              <Avatar className="w-32 h-32 border border-black">
              {/* <AvatarImage src={user.profilePhoto} alt={user.fullName} /> */}
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar> 

            )}

                <span>{member.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{member.relation}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="w-full bg-gray-700 rounded text-white hover:bg-gray-800"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create a Family
          </Button>
          <Button
            className="w-full bg-gray-700 rounded text-white hover:bg-gray-800"
            onClick={() => setIsJoinModalOpen(true)}
          >
            Join a Family
          </Button>
        </div>

        <Modal
          style="w-full bg-white rounded"
          title="Create a Family"
          description="Create a family"
          content={
            <form onSubmit={handleCreateFamily} className="flex flex-col space-y-4">
              <Input
                type="text"
                placeholder="Family Name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="border border-gray-300 rounded p-2"
                required
              />
              <Button type="submit" className="bg-blue-500 text-white rounded">
                Create a family
              </Button>
            </form>
          }
          openModal={isCreateModalOpen}
          setOpenModal={setIsCreateModalOpen}
        />

        <Modal
          style="w-full bg-white rounded"
          title="Join a Family"
          description="Join your family members here."
          content={   
          <form onSubmit={handleJoinFamily} className="flex flex-col space-y-4">
          <Input
            type="text"
            placeholder="Family Code"
            value={familyName}
            onChange={(e) => setFamilyCode(e.target.value)}
            className="border border-gray-300 rounded p-2"
            required
          />
          <Input
            type="text"
            placeholder="Relationship"
            value={familyName}
            onChange={(e) => setFamilyRelation(e.target.value)}
            className="border border-gray-300 rounded p-2"
            required
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white rounded">
            Join a family
          </Button>
        </form>}
          openModal={isJoinModalOpen}
          setOpenModal={setIsJoinModalOpen}
        />
      </motion.div>
    </div>
  )
}

const ProfileItem = ({ label, value }) => (
  <motion.div className="flex flex-col" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </motion.div>
)

export default Profile

