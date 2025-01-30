import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/Modal"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userData')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [familyPasskey, setFamilyPasskey] = useState(null)
  const [familyMembers, setFamilyMembers] = useState([])
  const navigate = useNavigate()

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [familyName, setFamilyName] = useState("")
  const [familyCode, setFamilyCode] = useState("")
  const [familyRelation, setFamilyRelation] = useState("")

  const fetchFamilyMembers = async (familyId) => {
    console.log('Fetching family members for family ID:', familyId)
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/accounts/families/${familyId}/members/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch family members')
      }

      const data = await response.json()
      console.log('Family members data:', data)
      setFamilyMembers(data)
      // Store family ID in localStorage
      localStorage.setItem('familyId', familyId)
    } catch (err) {
      console.error('Error fetching family members:', err)
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/accounts/users/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        })

        if (response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userData')
          navigate('/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const data = await response.json()
        setUser(data)
        localStorage.setItem('userData', JSON.stringify(data))
        
        // Only fetch family members if there's a family_id
        if (data.family_id) {
          await fetchFamilyMembers(data.family_id)
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
        // Check if stored user data exists before redirecting
        if (!localStorage.getItem('userData')) {
          navigate('/login')
        }
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No user data found</div>
      </div>
    )
  }

  const handleCreateFamily = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/families/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: familyName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create family')
      }

      const data = await response.json()
      console.log('Family created:', data)
      setFamilyPasskey(data.passkey)
      
      // Store the family ID
      if (data.id) {
        localStorage.setItem('familyId', data.id)
        await fetchFamilyMembers(data.id)
      }
      
      setIsCreateModalOpen(false)
      setFamilyName("")
    } catch (err) {
      console.error('Error creating family:', err)
    }
  }
  
  const handleJoinFamily = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/families/join/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passkey: familyCode,
          relationship: familyRelation
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to join family')
      }

      const data = await response.json()
      console.log('Successfully joined family:', data)
      
      // Close the modal and reset form
      setIsJoinModalOpen(false)
      setFamilyCode("")
      setFamilyRelation("")

      // Extract family ID and store it
      if (data.family && data.family.id) {
        localStorage.setItem('familyId', data.family.id)
        await fetchFamilyMembers(data.family.id)
      }

      // Update user data in state
      setUser(prevUser => ({
        ...prevUser,
        family_id: data.family.id
      }))

    } catch (err) {
      console.error('Error joining family:', err)
    }
  }

  const renderFamilyMembers = () => {
    if (!familyMembers || familyMembers.length === 0) {
      return <p className="text-center text-gray-500">No family members found</p>
    }

    return (
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {familyMembers.map((member) => (
          <li key={member.id} className="flex flex-col justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
            {member.user.profile_picture ? (
              <img 
                src={`http://127.0.0.1:8000${member.user.profile_picture}`}
                alt={`${member.user.first_name}'s profile`}
                className="w-24 h-24 rounded-full object-cover mb-3" 
              />
            ) : (
              <Avatar className="w-24 h-24 mb-3">
                <AvatarFallback>
                  {member.user.first_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <h4 className="font-semibold text-lg">
              {`${member.user.first_name} ${member.user.last_name}`}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {member.relationship}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const showJoinButton = !user?.family_id && !familyMembers.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center w-full justify-center px-2 sm:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 relative top-28 sm:top-20 rounded shadow-lg p-6 w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {user.profile_picture ? (
              <img 
                src={`http://127.0.0.1:8000${user.profile_picture}`} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`;
                }}
              />
            ) : (
              <Avatar className="w-32 h-32 border border-black">
                <AvatarFallback>{user.first_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </motion.div>
          <div className="flex-1">
            <motion.h2
              className="sm:text-3xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {`${user.first_name} ${user.middle_name || ''} ${user.last_name}`}
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Phone" value={user.phone_number} />
              <ProfileItem label="Role" value={user.role} />
              <ProfileItem label="Gender" value={user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other'} />
              <ProfileItem label="Address" value={user.address} />
              <ProfileItem label="City" value={user.city} />
              <ProfileItem label="State" value={user.state} />
              <ProfileItem label="Pincode" value={user.pincode} />
            </motion.div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2 text-center">Family Members</h3>
          {renderFamilyMembers()}
        </div>

        {familyPasskey && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-md">
            <p className="text-center text-green-800 font-semibold mb-2">
              Share this key with your family members to join the family:
            </p>
            <p className="text-center text-2xl font-bold text-green-900">
              {familyPasskey}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!user?.family_id && (
            <Button
              className="w-full bg-gray-700 rounded text-white hover:bg-gray-800"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create a Family
            </Button>
          )}
          {showJoinButton && (
            <Button
              className="w-full bg-gray-700 rounded text-white hover:bg-gray-800"
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join a Family
            </Button>
          )}
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
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                className="border border-gray-300 rounded p-2"
                required
              />
              <Input
                type="text"
                placeholder="Relationship"
                value={familyRelation}
                onChange={(e) => setFamilyRelation(e.target.value)}
                className="border border-gray-300 rounded p-2"
                required
              />
              <Button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white rounded">
                Join a family
              </Button>
            </form>
          }
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

