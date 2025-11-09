



// video privacy setting
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function UploadPage({ token, setCurrentPage }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public"); // ✅ new
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // show preview
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!token) return alert("You must be logged in to upload videos");
    if (!file) return alert("Please select a video file");

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("privacy", privacy); // ✅ send privacy level

      const res = await axios.post(
        "http://localhost:5000/api/videos/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", res.data);

      alert("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      setPrivacy("public");

      // Redirect to profile to see uploaded video
      if (setCurrentPage) setCurrentPage("profile");
    } catch (err) {
      console.error("Upload error:", err.response || err);
      if (err.response?.status === 401)
        alert("Unauthorized. Please log in again.");
      else if (err.response?.status === 500)
        alert("Server error. Try again later.");
      else alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar token={token} setCurrentPage={setCurrentPage} />
      <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4">Upload a New Video</h2>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />

          {/* ✅ Privacy Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Privacy Setting:
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="public">🌍 Public — visible to everyone</option>
              <option value="network">👥 Network — only your subscribers</option>
              <option value="private">🔒 Private — only you</option>
            </select>
          </div>

          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="p-2 border rounded"
          />
          {preview && (
            <div className="mt-2">
              <h4 className="font-semibold">Preview:</h4>
              <video
                src={preview}
                controls
                className="w-full max-h-64 border rounded"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </>
  );
}
