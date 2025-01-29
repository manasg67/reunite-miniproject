"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/Modal"
// import { Modal } from "@/components/Modal"

const Profile = () => {
  // This would typically come from your app's state management or API
  const user = {
    fullName: "John Doe",
    profilePhoto: "/images/john-doe.jpg",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center w-full justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Avatar className="w-32 h-32 border border-black">
                  <AvatarImage src={user.profilePhoto} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.h2
                className="text-xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {user.fullName}
              </motion.h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ProfileItem label="Gender" value={user.gender} />
                <ProfileItem label="Email" value={user.email} />
                <ProfileItem label="Phone" value={user.phone} />
              </motion.div>
            </div>
          </CardContent>
          <CardFooter>
            <Modal
              style="w-full bg-white rounded"
              trigger={<Button className="w-full bg-gray-700 rounded text-white hover:bg-gray-800">Add Family Members</Button>}
              title="Add Family Members"
              description="Add details of your family members here."
              content={<div>Family member form goes here.</div>}
              openModal={isModalOpen}
              setOpenModal={setIsModalOpen}
            />
          </CardFooter>
        </Card>
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
