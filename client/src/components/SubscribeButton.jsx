import React from 'react';

const SubscribeButton = ({ subscribed, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded font-semibold ${
      subscribed ? 'bg-gray-300 text-black' : 'bg-red-600 text-white'
    } hover:opacity-90 transition`}
  >
    {subscribed ? 'Subscribed' : 'Subscribe'}
  </button>
);

export default SubscribeButton;
