import React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PublicForum() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [username, setUsername] = useState("")
  const fileInputRef = useRef(null)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    const initialMessages = [
      {
        id: "1",
        type: "text",
        content: "Welcome to the Missing Persons Information Forum. Please share any relevant information here.",
        sender: "System",
        timestamp: Date.now(),
      },
    ]
    setMessages(initialMessages)

  

    scrollToBottom()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: "text",
        content: inputMessage,
        sender: username,
        timestamp: Date.now(),
      }
      setMessages([...messages, newMessage])
      setInputMessage("")
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newMessage = {
          id: Date.now().toString(),
          type: "image",
          content: event.target?.result,
          sender: username,
          timestamp: Date.now(),
        }
        setMessages([...messages, newMessage])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleShareLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const locationUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15&layers=M`
        const newMessage = {
          id: Date.now().toString(),
          type: "location",
          content: locationUrl,
          sender: username,
          timestamp: Date.now(),
        }
        setMessages([...messages, newMessage])
      }, 
      (error) => {
        alert("Error getting location: " + error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    } else {
      alert("Geolocation is not supported by your browser")
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.header}>Missing Persons Information Forum</h1>
        <div ref={chatContainerRef} style={styles.chatContainer}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={styles.messageContainer}
              >
                <strong style={styles.sender}>{message.sender}: </strong>
                {message.type === "text" && <span style={styles.messageContent}>{message.content}</span>}
                {message.type === "image" && (
                  <img src={message.content || "/placeholder.svg"} alt="Shared" style={styles.image} />
                )}
                {message.type === "location" && (
                  <a href={message.content} target="_blank" rel="noopener noreferrer" style={styles.locationLink}>
                    📍 View Shared Location
                  </a>
                )}
                <span style={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <form onSubmit={handleSendMessage} style={styles.form}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Share information here..."
            style={styles.input}
          />
          <motion.button type="submit" style={styles.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Send
          </motion.button>
          <input type="file" accept="image/*" onChange={handleFileUpload} ref={fileInputRef} style={styles.fileInput} />
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Share Photo
          </motion.button>
          <motion.button
            type="button"
            onClick={handleShareLocation}
            style={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Share Location
          </motion.button>
        </form>
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(45deg, #f0f8ff, #e6f3ff)",
    padding: "20px",
    marginTop: "60px",
  },
  container: {
    maxWidth: "800px",
    width: "100%",
    padding: "20px",
    fontFamily:
      "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    backgroundColor: "#ffffff",
    color: "#333333",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#1a5f7a",
    fontSize: "2em",
    marginBottom: "20px",
  },
  chatContainer: {
    height: "60vh",
    overflowY: "auto",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
  },
  messageContainer: {
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
  },
  sender: {
    color: "#1a5f7a",
  },
  messageContent: {
    wordBreak: "break-word",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "200px",
    display: "block",
    marginTop: "10px",
    borderRadius: "5px",
  },
  locationLink: {
    color: "#2c7fb8",
    textDecoration: "none",
  },
  timestamp: {
    fontSize: "0.8em",
    color: "#888",
    marginLeft: "10px",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  input: {
    flexGrow: 1,
    padding: "12px",
    fontSize: "16px",
    borderRadius: "25px",
    border: "1px solid #e0e0e0",
    outline: "none",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#1a5f7a",
    color: "#ffffff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  fileInput: {
    display: "none",
  },
}
