import React from "react";
import Hero from "../components/Hero";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Hero
        title="About RCRB EXPO"
        description="Connecting innovators, industry leaders, and enthusiasts in a world-class exhibition experience."
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24 space-y-24">
        {/* Overview */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">Overview</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                RCRB EXPO is a premier annual event dedicated to showcasing the latest advancements in technology, business, and innovation. 
                Since its inception, it has served as a dynamic platform for networking, knowledge sharing, and business growth. 
                We bring together exhibitors from diverse industries and visitors from across the globe to foster collaboration and drive progress.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 sm:h-80 w-full object-cover flex items-center justify-center text-gray-400">
              {/* Placeholder for an image */}
              <span className="text-lg">Overview Image</span>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 italic">
              "To empower businesses and individuals by providing a world-class platform for showcasing innovation, facilitating meaningful connections, and inspiring the future of industry."
            </p>
          </div>
        </section>

        {/* What to Expect */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12 text-center">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Innovation Showcase</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover cutting-edge products and services from leading companies and startups.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Networking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with industry experts, potential partners, and like-minded professionals.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Workshops & Talks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gain insights from keynote speakers and participate in interactive workshops.
              </p>
            </div>
          </div>
        </section>

        {/* Past Achievements */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12 text-center">Past Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">500+</p>
              <p className="text-gray-600 dark:text-gray-300">Exhibitors</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">50k+</p>
              <p className="text-gray-600 dark:text-gray-300">Visitors</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">100+</p>
              <p className="text-gray-600 dark:text-gray-300">Speakers</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">10+</p>
              <p className="text-gray-600 dark:text-gray-300">Years</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
