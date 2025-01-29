import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, Shield, Clock, AlertTriangle, Camera, FileText, Fingerprint, Heart } from "lucide-react"
import Banner from "../components/banner"
import SuccessStories from "../components/SuccessStories"

export default function LandingPage() {
  return (
    <div className="flex flex-col ">
      <main className="flex-1">
      <section className="w-full h-[700px] py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-700 via-pure-500 to-blue-200 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left column with text */}
          <div className="flex flex-col space-y-4">
            <div className="space-y-2 mt-[-100px]">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Unite Hearts, Find Hope
              </h1>
              <p className="max-w-[700px] md:text-xl lg:text-2xl">
                Empowering communities to bring loved ones home through innovative technology and compassionate
                action.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
            
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-300" />
                <span className="text-sm">10,000+ Reunited</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="text-sm">Secure & Confidential</span>
              </div>
            </div>
          </div>
          
          {/* Right column with image */}
          <div className="flex justify-center md:justify-end ml-32">
            <img
              src="/images/mobile_1.jpg"
              alt="Unite Hearts Initiative"
              className="rounded-full object-cover" 
            />
          </div>
        </div>
      </div>
    </section>

        <section className="w-full py-12 bg-yellow-100">
          <div className="px-4 md:px-6">
            <div className="flex items-center justify-between p-4 bg-yellow-300 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-yellow-700" />
                <span className="font-semibold text-yellow-800">Awareness Alert</span>
              </div>
              <p className="text-yellow-800">Every minute counts in finding a missing person. Report immediately!</p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ">
          <div className=" px-4 md:px-6 ">
            <h2 className="text-3xl font-bold text-center mb-12">Multiple Ways to Search</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <FileText className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Search by Name</h3>
                <p className="text-center mb-4">Enter the full name of the missing person to start your search.</p>
                <Button className="w-full">Search by Name</Button>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <Fingerprint className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Search by Aadhaar</h3>
                <p className="text-center mb-4">Use Aadhaar number for a precise and quick search.</p>
                <Button className="w-full">Search by Aadhaar</Button>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <Camera className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Facial Recognition</h3>
                <p className="text-center mb-4">Upload a photo to use our advanced facial recognition technology.</p>
                <Button className="w-full">Search by Face</Button>
              </div>
            </div>
          </div>
        </section>



  <SuccessStories/>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <Banner />
        </section>
      </main>
    </div>
  )
}

