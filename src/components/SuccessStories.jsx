import React from 'react';
import { Star, ArrowRight, Heart, Clock, Users } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      title: "Reunited After 5 Years",
      description: "A family was reunited with their missing child after 5 years, thanks to our Aadhaar-based search system.",
      image: "/api/placeholder/400/300",
      stats: {
        timeToFind: "5 years",
        location: "Mumbai",
        impactedLives: "15+"
      }
    },
    {
      title: "Found Within Hours",
      description: "An elderly person with memory issues was located within hours of being reported missing.",
      image: "/api/placeholder/400/300",
      stats: {
        timeToFind: "6 hours",
        location: "Delhi",
        impactedLives: "8+"
      }
    },
    {
      title: "Cross-State Reunion",
      description: "A missing teenager was found in a different state and safely returned to their family.",
      image: "/api/placeholder/400/300",
      stats: {
        timeToFind: "72 hours",
        location: "Karnataka",
        impactedLives: "12+"
      }
    }
  ];

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Reuniting Families, Restoring Hope
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Every reunion is a testament to hope. Discover the stories of families brought back together through our platform's innovative approach.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-3 gap-4 rounded-xl bg-blue-50 p-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1000+</div>
            <div className="text-sm text-gray-600">Families Reunited</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">24hrs</div>
            <div className="text-sm text-gray-600">Average Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Success Stories Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <div key={index} className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{story.title}</h3>
                <p className="mb-4 text-gray-600">{story.description}</p>
                <div className="mb-4 grid grid-cols-3 gap-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {story.stats.timeToFind}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {story.stats.impactedLives}
                  </div>
                  <div className="text-right text-blue-600">{story.stats.location}</div>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  Read full story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700">
            View All Success Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;