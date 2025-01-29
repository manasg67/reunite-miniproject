import React, { useState, useEffect } from "react"
import QRCode from "qrcode"
import { Page, Text, View, Image, Document, StyleSheet } from "@react-pdf/renderer"

export default function PosterPDF({ person }) {
  const [qrCode, setQrCode] = useState(null)

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "white",
      padding: 0,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      padding: 20,
    },
    headerBar: {
      width: 100,
      height: 60,
      backgroundColor: "black",
    },
    missingText: {
      fontSize: 72,
      fontWeight: "bold",
      color: "#FF0000",
      textAlign: "center",
      padding: "0 20px",
    },
    imageContainer: {
      position: "relative",
      alignItems: "center",
      padding: "0 40px",
    },
    personImage: {
      width: "100%",
      height: 400,
      objectFit: "cover",
    },
    nameOverlay: {
      position: "absolute",
      bottom: 0,
      backgroundColor: "#FF0000",
      padding: "10px 40px",
      width: "80%",
    },
    name: {
      fontSize: 36,
      color: "white",
      textAlign: "center",
      fontWeight: "bold",
    },
    detailsSection: {
      display: "flex",
      flexDirection: "row",
      padding: "20px 40px",
      alignItems: "center",
    },
    detailText: {
      fontSize: 24,
      marginBottom: 5,
      textAlign: "center",
    },
    blackBar: {
      backgroundColor: "black",
      padding: 15,
      marginTop: 5,
      width: "100%",
    },
    missingSinceText: {
      color: "white",
      fontSize: 32,
      textAlign: "center",
      fontWeight: "bold",
    },
    lastSeenText: {
      fontSize: 24,
      textAlign: "center",
      marginTop: 20,
      padding: "0 20px",
    },
    footer: {
      backgroundColor: "#FF0000",
      padding: 20,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    pleaseHelp: {
      color: "white",
      fontSize: 28,
      textAlign: "center",
      marginBottom: 10,
    },
    contactNumber: {
      color: "white",
      fontSize: 48,
      textAlign: "center",
      fontWeight: "bold",
    },
    qrSection: {
      position: "absolute",
      right: 20,
      bottom: 200,
      width: 100,
      height: 100,
    },
  })

  useEffect(() => {
    const generateQrCode = async () => {
      const baseUrl = window.location.origin
      const qrData = `${baseUrl}/missing-person/${person.id}`
      try {
        const qr = await QRCode.toDataURL(qrData)
        setQrCode(qr)
      } catch (err) {
        console.error("Failed to generate QR code", err)
      }
    }
    generateQrCode()
  }, [person.id])

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerBar} />
          <Text style={styles.missingText}>MISSING</Text>
          <View style={styles.headerBar} />
        </View>

        <View style={styles.imageContainer}>
          <Image src={person.photo || "/placeholder.svg"} style={styles.personImage} />
          <View style={styles.nameOverlay}>
            <Text style={styles.name}>{person.name.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.detailText}>Age: {person.age}</Text>
          <Text style={styles.detailText}>Height: {person.height}</Text>
          <Text style={styles.detailText}>Weight: {person.weight}</Text>
        </View>

        <View style={styles.blackBar}>
          <Text style={styles.missingSinceText}>MISSING SINCE {person.missingSince}</Text>
        </View>

        <Text style={styles.lastSeenText}>{person.lastSeenWearing}</Text>

        {qrCode && (
          <View style={styles.qrSection}>
            <Image src={qrCode || "/placeholder.svg"} />
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.pleaseHelp}>Please Help</Text>
          <Text style={styles.contactNumber}>CALL: {person.contactNo}</Text>
        </View>
      </Page>
    </Document>
  )
}

