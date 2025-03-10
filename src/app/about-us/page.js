import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <div className="mb-6">
        <img 
          src="path/to/your/image.jpg" 
          alt="About Us" 
          className="w-full h-64 object-cover rounded-lg" 
        />
      </div>
      <p className="text-gray-700 mb-4">
        Welcome to our social media platform where you can connect with friends and share your thoughts.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
      <p className="text-gray-700 mb-4">
        To create a space where everyone can express themselves freely and connect with others.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
      <p className="text-gray-700 mb-4">
        We envision a world where everyone can share their stories and experiences, fostering a sense of community and belonging.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Inclusivity</li>
        <li>Creativity</li>
        <li>Integrity</li>
        <li>Collaboration</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">Study Music Feature</h2>
      <p className="text-gray-700 mb-4">
        Enjoy our curated playlists to help you focus while studying!
      </p>
      <audio controls className="w-full mt-4">
        <source src="path/to/your/music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AboutUs;
