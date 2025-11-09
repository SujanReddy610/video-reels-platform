

// import { useEffect, useState } from 'react';
// import jwt_decode from 'jwt-decode';
// import API from './api'; // centralized axios instance

// import Navbar from './components/Navbar';
// import Profile from './components/Profile';
// import VideoList from './components/VideoList';
// import './index.css';

// <Route path="/reels" element={<ReelsPage />} />
// import ReelsPage from "./pages/ReelsPage.jsx";

// <Routes>
//   {/* existing routes */}
//   <Route path="/reels" element={<ReelsPage />} />
// </Routes>



// export default function App() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Token management
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [decodedToken, setDecodedToken] = useState(null);

//   // Page state
//   const [currentPage, setCurrentPage] = useState('home');

//   // Form states
//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showForm, setShowForm] = useState(!token);

//   // Comment state
//   const [commentText, setCommentText] = useState({});

//   // Reset video filters when returning home
//   const resetHome = () => {
//     setCurrentPage('home');
//     // Reset videos to full list if needed (refetch)
//     fetchVideos();
//   };

//   // Decode token on load
//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwt_decode(token);
//         setDecodedToken(decoded);
//         setShowForm(false);
//       } catch (err) {
//         console.error('Invalid token', err);
//         handleLogout();
//       }
//     }
//   }, [token]);

//   // Fetch videos function
//   const fetchVideos = async () => {
//     if (!token) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await API.get('/videos'); // token automatically attached
//       setVideos(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch videos. Please login again.');
//       handleLogout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch videos on home page load
//   useEffect(() => {
//     if (currentPage === 'home') {
//       fetchVideos();
//     }
//   }, [currentPage, token]);

//   // Login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       const res = await API.post('/auth/login', { email, password });
//       setToken(res.data.token);
//       localStorage.setItem('token', res.data.token);
//       setShowForm(false);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   // Register
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       await API.post('/auth/register', { name, email, password });
//       alert('Registration successful! You can now login.');
//       setIsLogin(true);
//       setName('');
//       setEmail('');
//       setPassword('');
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   // Logout
//   const handleLogout = () => {
//     setToken(null);
//     setDecodedToken(null);
//     localStorage.removeItem('token');
//     setShowForm(true);
//     setCurrentPage('home');
//   };

//   // Handle Like/Dislike
//   const handleReaction = async (videoId, type) => {
//     try {
//       const res = await API.post(`/videos/${videoId}/react`, { type });
//       const updatedReaction = res.data;

//       setVideos((prev) =>
//         prev.map((v) => {
//           if (v.id !== videoId) return v;

//           const prevReaction = v.VideoReactions?.find(
//             (r) => r.userId === updatedReaction.userId
//           );

//           let likes = v.likes || 0;
//           let dislikes = v.dislikes || 0;

//           if (prevReaction) {
//             if (prevReaction.type === 'like') likes -= 1;
//             if (prevReaction.type === 'dislike') dislikes -= 1;
//           }

//           if (updatedReaction.type === 'like') likes += 1;
//           if (updatedReaction.type === 'dislike') dislikes += 1;

//           const newReactions =
//             v.VideoReactions?.filter((r) => r.userId !== updatedReaction.userId) || [];
//           newReactions.push(updatedReaction);

//           return { ...v, likes, dislikes, VideoReactions: newReactions };
//         })
//       );
//     } catch (err) {
//       console.error('Reaction failed:', err);
//       alert('Failed to react to video');
//     }
//   };

//   // Handle Comment
//   const handleComment = async (videoId) => {
//     const text = commentText[videoId];
//     if (!text?.trim()) return;

//     try {
//       const res = await API.post(`/videos/${videoId}/comment`, { text });
//       setCommentText((prev) => ({ ...prev, [videoId]: '' }));

//       setVideos((prev) =>
//         prev.map((v) =>
//           v.id === videoId
//             ? { ...v, VideoComments: [...(v.VideoComments || []), res.data.comment || res.data] }
//             : v
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert('Failed to add comment');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
//       <Navbar
//         token={token}
//         handleLogout={handleLogout}
//         setCurrentPage={setCurrentPage}
//         resetHome={resetHome} // pass reset function
//       />

//       {showForm && !token && (
//         <div className="flex items-center justify-center mt-10">
//           <div className="bg-white p-6 rounded shadow-md w-80">
//             <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
//             {error && <p className="text-red-500 mb-2">{error}</p>}
//             <form onSubmit={isLogin ? handleLogin : handleRegister}>
//               {!isLogin && (
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full p-2 mb-3 border rounded"
//                   required
//                 />
//               )}
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-2 mb-3 border rounded"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-2 mb-3 border rounded"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//               >
//                 {isLogin ? 'Login' : 'Register'}
//               </button>
//             </form>
//             <p className="mt-3 text-sm text-gray-600">
//               {isLogin ? 'New user?' : 'Already have an account?'}{' '}
//               <button
//                 onClick={() => {
//                   setIsLogin(!isLogin);
//                   setError(null);
//                 }}
//                 className="text-blue-600 underline"
//               >
//                 {isLogin ? 'Register here' : 'Login here'}
//               </button>
//             </p>
//           </div>
//         </div>
//       )}

//       {!showForm && token && (
//         <main>
//           {currentPage === 'home' && (
//             <VideoList
//               videos={videos}
//               setVideos={setVideos}
//               handleReaction={handleReaction}
//               handleComment={handleComment}
//               commentText={commentText}
//               setCommentText={setCommentText}
//               setCurrentPage={setCurrentPage}
//               handleLogout={handleLogout}
//             />
//           )}

//           {currentPage === 'profile' && (
//             <Profile
//               token={token}
//               handleReaction={handleReaction}
//               handleComment={handleComment}
//             />
//           )}
//         </main>
//       )}
//     </div>
//   );
// }







































// code with fast video play
// import { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';
// import API from './api';
// import UserList from './components/UserList';
// import MessageDetail from './components/MessageDetail';

// import Navbar from './components/Navbar';
// import Profile from './components/Profile';
// import VideoList from './components/VideoList';
// import './index.css';

// export default function App() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [decodedToken, setDecodedToken] = useState(null);

//   const [currentPage, setCurrentPage] = useState('home');

//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showForm, setShowForm] = useState(!token);

//   const [commentText, setCommentText] = useState({});

//   // Decode token
//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwt_decode(token);
//         setDecodedToken(decoded);
//         setShowForm(false);
//       } catch (err) {
//         console.error('Invalid token', err);
//         handleLogout();
//       }
//     }
//   }, [token]);

//   const fetchVideos = async () => {
//     if (!token) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await API.get('/videos');
//       setVideos(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch videos.');
//       handleLogout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (currentPage === 'home') fetchVideos();
//   }, [currentPage, token]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/auth/login', { email, password });
//       setToken(res.data.token);
//       localStorage.setItem('token', res.data.token);
//       setShowForm(false);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   const handleLogout = () => {
//     setToken(null);
//     setDecodedToken(null);
//     localStorage.removeItem('token');
//     setShowForm(true);
//     setCurrentPage('home');
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post('/auth/register', { name, email, password });
//       alert('Registration successful! You can now login.');
//       setIsLogin(true);
//       setName('');
//       setEmail('');
//       setPassword('');
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   // Layout: UserList on left, content on right
//   const MainContent = () => {
//     return (
//       <div className="flex h-screen">
//         <div className="w-64 border-r">
//           <UserListWrapper />
//         </div>
//         <div className="flex-grow p-4 overflow-y-auto">
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 currentPage === 'home' ? (
//                   <VideoList
//                     videos={videos}
//                     setVideos={setVideos}
//                     handleComment={handleComment}
//                     handleReaction={handleReaction}
//                     commentText={commentText}
//                     setCommentText={setCommentText}
//                   />
//                 ) : currentPage === 'profile' ? (
//                   <Profile token={token} />
//                 ) : null
//               }
//             />
//             <Route path="/group/:groupId" element={<MessageDetail />} />
//           </Routes>
//         </div>
//       </div>
//     );
//   };

//   const handleReaction = async (videoId, type) => {
//     try {
//       const res = await API.post(`/videos/${videoId}/react`, { type });
//       const updatedReaction = res.data;
//       setVideos((prev) =>
//         prev.map((v) => {
//           if (v.id !== videoId) return v;
//           const prevReaction = v.VideoReactions?.find(
//             (r) => r.userId === updatedReaction.userId
//           );
//           let likes = v.likes || 0;
//           let dislikes = v.dislikes || 0;

//           if (prevReaction) {
//             if (prevReaction.type === 'like') likes -= 1;
//             if (prevReaction.type === 'dislike') dislikes -= 1;
//           }

//           if (updatedReaction.type === 'like') likes += 1;
//           if (updatedReaction.type === 'dislike') dislikes += 1;

//           const newReactions =
//             v.VideoReactions?.filter((r) => r.userId !== updatedReaction.userId) || [];
//           newReactions.push(updatedReaction);

//           return { ...v, likes, dislikes, VideoReactions: newReactions };
//         })
//       );
//     } catch (err) {
//       console.error('Reaction failed:', err);
//       alert('Failed to react to video');
//     }
//   };

//   const handleComment = async (videoId) => {
//     const text = commentText[videoId];
//     if (!text?.trim()) return;

//     try {
//       const res = await API.post(`/videos/${videoId}/comment`, { text });
//       setCommentText((prev) => ({ ...prev, [videoId]: '' }));
//       setVideos((prev) =>
//         prev.map((v) =>
//           v.id === videoId
//             ? { ...v, VideoComments: [...(v.VideoComments || []), res.data.comment || res.data] }
//             : v
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert('Failed to add comment');
//     }
//   };

//   // Wrapper to handle navigation from UserList
//   const UserListWrapper = () => {
//     const navigate = useNavigate();
//     const handleSelectUser = (user) => {
//       // Navigate to the group chat page
//       navigate(`/group/${user.id}`);
//     };

//     return <UserList onSelectUser={handleSelectUser} />;
//   };

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100 text-gray-900">
//         <Navbar token={token} handleLogout={handleLogout} setCurrentPage={setCurrentPage} />
//         {showForm && !token ? (
//           <div className="flex items-center justify-center mt-10">
//             <div className="bg-white p-6 rounded shadow-md w-80">
//               <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
//               {error && <p className="text-red-500 mb-2">{error}</p>}
//               <form onSubmit={isLogin ? handleLogin : handleRegister}>
//                 {!isLogin && (
//                   <input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full p-2 mb-3 border rounded"
//                     required
//                   />
//                 )}
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full p-2 mb-3 border rounded"
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full p-2 mb-3 border rounded"
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                 >
//                   {isLogin ? 'Login' : 'Register'}
//                 </button>
//               </form>
//               <p className="mt-3 text-sm text-gray-600">
//                 {isLogin ? 'New user?' : 'Already have an account?'}{' '}
//                 <button
//                   onClick={() => {
//                     setIsLogin(!isLogin);
//                     setError(null);
//                   }}
//                   className="text-blue-600 underline"
//                 >
//                   {isLogin ? 'Register here' : 'Login here'}
//                 </button>
//               </p>
//             </div>
//           </div>
//         ) : (
//           <MainContent />
//         )}
//       </div>
//     </Router>
//   );
// }


// code for reels
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import API from './api';

import Navbar from './components/Navbar';
import Profile from './components/Profile';
import VideoList from './components/VideoList';
import ReelsPage from './pages/ReelsPage.jsx';
import './index.css';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(!token);
  const [commentText, setCommentText] = useState({});

  // Reset to home and fetch videos
  const resetHome = () => {
    setCurrentPage('home');
    fetchVideos();
  };

  // Decode JWT token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setDecodedToken(decoded);
        setShowForm(false);
      } catch (err) {
        console.error('Invalid token', err);
        handleLogout();
      }
    }
  }, [token]);

  // Fetch all videos
  const fetchVideos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await API.get('/videos');
      setVideos(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch videos.');
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'home') fetchVideos();
  }, [currentPage, token]);

  // Authentication handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      alert('Registration successful! You can now login.');
      setIsLogin(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setDecodedToken(null);
    localStorage.removeItem('token');
    setShowForm(true);
    setCurrentPage('home');
  };

  // Like / dislike reactions
  const handleReaction = async (videoId, type) => {
    try {
      const res = await API.post(`/videos/${videoId}/react`, { type });
      const updatedReaction = res.data;

      setVideos((prev) =>
        prev.map((v) => {
          if (v.id !== videoId) return v;
          const prevReaction = v.VideoReactions?.find(
            (r) => r.userId === updatedReaction.userId
          );

          let likes = v.likes || 0;
          let dislikes = v.dislikes || 0;

          if (prevReaction) {
            if (prevReaction.type === 'like') likes -= 1;
            if (prevReaction.type === 'dislike') dislikes -= 1;
          }

          if (updatedReaction.type === 'like') likes += 1;
          if (updatedReaction.type === 'dislike') dislikes += 1;

          const newReactions =
            v.VideoReactions?.filter((r) => r.userId !== updatedReaction.userId) || [];
          newReactions.push(updatedReaction);

          return { ...v, likes, dislikes, VideoReactions: newReactions };
        })
      );
    } catch (err) {
      console.error('Reaction failed:', err);
      alert('Failed to react to video');
    }
  };

  // Add comment
  const handleComment = async (videoId) => {
    const text = commentText[videoId];
    if (!text?.trim()) return;
    try {
      const res = await API.post(`/videos/${videoId}/comment`, { text });
      setCommentText((prev) => ({ ...prev, [videoId]: '' }));
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? { ...v, VideoComments: [...(v.VideoComments || []), res.data.comment || res.data] }
            : v
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to add comment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <Navbar
        token={token}
        handleLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        resetHome={resetHome}
      />

      {showForm && !token ? (
        // ✅ Auth form (Login / Register)
        <div className="flex items-center justify-center mt-10 pt-32">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 mb-3 border rounded"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <p className="mt-3 text-sm text-gray-600">
              {isLogin ? 'New user?' : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-blue-600 underline"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>
      ) : (
        // ✅ Main routes
        <Routes>
          <Route
            path="/"
            element={
              currentPage === 'home' ? (
                <VideoList
                  videos={videos}
                  setVideos={setVideos}
                  handleReaction={handleReaction}
                  handleComment={handleComment}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  setCurrentPage={setCurrentPage}
                  handleLogout={handleLogout}
                />
              ) : (
                <Profile
                  token={token}
                  handleReaction={handleReaction}
                  handleComment={handleComment}
                />
              )
            }
          />

          {/* ✅ Reels Route */}
          <Route path="/reels" element={<ReelsPage token={token} />} />
        </Routes>
      )}
    </div>
  );
}


