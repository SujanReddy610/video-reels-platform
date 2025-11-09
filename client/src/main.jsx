



























// code for youtube
// main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import UploadPage from './pages/Upload.jsx'
import VideoDetails from "./pages/VideoDetail.jsx";
import VideoPage from './pages/VideoPage.jsx' 
import Profile from './components/Profile.jsx' // Assuming you have a Profile component
import Notifications from "./components/Notifications.jsx";
import MessageDetail from './pages/MessageDetail.jsx';
import ReelsPage from './pages/ReelsPage';


import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App component is now the layout that renders the home content */}
        {/* <Route path="/" element={<App />} />  */}
        <Route path="/*" element={<App />} />
        {/* <Route path="/" element={<App />} />  */}
        {/* These components are standalone pages handled by the router */}
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/video/:id" element={<VideoPage />} /> 
        <Route path="/video/:id" element={<VideoDetails />} />
        <Route path="/notifications" element={<Notifications token={localStorage.getItem('token')} />} />
        <Route path="/messages/:id" element={<MessageDetail />} />

        <Route path="/reels" element={<ReelsPage />} />
        





      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)




// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import App from './App.jsx'
// import UploadPage from './pages/Upload.jsx'
// import VideoPage from './pages/VideoPage.jsx' 
// import Profile from './components/Profile.jsx'
// import Notifications from "./components/Notifications.jsx";
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         {/* App component is now the layout that renders the home content */}
//         <Route path="/" element={<App />} /> 
//         {/* These components are standalone pages handled by the router */}
//         <Route path="/upload" element={<UploadPage />} />
//         <Route path="/profile" element={<Profile />} /> 
//         {/* Consolidated the route for a single video to use VideoPage */}
//         <Route path="/video/:id" element={<VideoPage />} /> 
//         <Route path="/notifications" element={<Notifications token={localStorage.getItem('token')} />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// )




