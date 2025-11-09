// // code for youtube
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api/api.js';

// export default function LoginPage({ setToken }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await API.post('/auth/login', { email, password });
//       const { token } = res.data;
//       setToken(token);
//       localStorage.setItem('token', token);
//       navigate('/'); // Redirect to home
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
//         <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Login</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded"/>
//           <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded"/>
//           <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }
