



// import React, { useEffect, useState } from "react";
// import { getQuestions, askQuestion } from "../questionService";

// export default function VideoQA({ videoId, token }) {
//   const [questions, setQuestions] = useState([]);
//   const [newQuestion, setNewQuestion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Load questions whenever videoId or token changes
//   useEffect(() => {
//     if (videoId && token) {
//       loadQuestions();
//     }
//   }, [videoId, token]);

//   const loadQuestions = async () => {
//     setLoading(true);
//     try {
//       const data = await getQuestions(videoId, token);
//       setQuestions(data);
//     } catch (err) {
//       console.error("Error loading questions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddQuestion = async () => {
//     if (!newQuestion.trim()) return;

//     setSubmitting(true);
//     try {
//       await askQuestion(videoId, newQuestion, 0, token); // Timestamp optional
//       setNewQuestion("");
//       await loadQuestions();
//     } catch (err) {
//       console.error("Failed to add question:", err);
//       alert(err.message || "Failed to submit question");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md mt-6">
//       <h3 className="text-xl font-semibold mb-3">Q&A Section</h3>

//       {token ? (
//         <div className="flex mb-3">
//           <input
//             type="text"
//             value={newQuestion}
//             onChange={(e) => setNewQuestion(e.target.value)}
//             placeholder="Ask a question about this video..."
//             className="flex-1 border rounded-l px-3 py-2"
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !submitting) handleAddQuestion();
//             }}
//             disabled={submitting}
//           />
//           <button
//             onClick={handleAddQuestion}
//             disabled={!newQuestion.trim() || submitting}
//             className={`px-4 py-2 rounded-r text-white ${
//               newQuestion.trim() && !submitting
//                 ? "bg-blue-600 hover:bg-blue-700"
//                 : "bg-gray-300 cursor-not-allowed"
//             }`}
//           >
//             {submitting ? "Submitting..." : "Ask"}
//           </button>
//         </div>
//       ) : (
//         <p className="text-gray-500 mb-3">Login to ask questions.</p>
//       )}

//       {loading ? (
//         <p className="text-gray-500">Loading questions...</p>
//       ) : questions.length === 0 ? (
//         <p className="text-gray-500">No questions yet. Be the first!</p>
//       ) : (
//         <ul className="space-y-2">
//           {questions.map((q) => (
//             <li key={q.id} className="border-b pb-2">
//               <p className="font-medium">{q.text}</p>
//               <p className="text-xs text-gray-400">
//                 Asked by {q.User?.username || "Anonymous"}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, addDoc, onSnapshot, collection, query, serverTimestamp } from 'firebase/firestore';

// --- Configuration and Utilities ---

// These global variables are provided by the canvas environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initialAuthToken : null;

// Hardcoded video ID for demonstration purposes
const DEMO_VIDEO_ID = "video_tutorial_123";

// Firestore Collection Path specific to this video
const VIDEO_QA_PATH = (appId, videoId) => `/artifacts/${appId}/public/data/videos/${videoId}/questions`;

/**
 * Subcomponent to handle a single question, its answer form, and the list of replies.
 */
const QuestionItem = ({ question, db, userId, isAuthReady }) => {
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState('');
    const [isAnswering, setIsAnswering] = useState(false);
    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

    // Utility to format seconds into MM:SS
    const formatTime = (seconds) => {
        const time = parseFloat(seconds);
        if (isNaN(time) || time <= 0) return null;
        const minutes = Math.floor(time / 60);
        const remainingSeconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };
    
    const formattedTime = formatTime(question.timestamp);

    // 1. Real-time Answers Listener
    useEffect(() => {
        // FIX: Ensure userId is available before setting up the listener
        if (!db || !userId) return;

        // Path: /.../questions/{question.id}/answers
        const answersCollectionRef = collection(db, VIDEO_QA_PATH(appId, DEMO_VIDEO_ID), question.id, 'answers');
        const q = query(answersCollectionRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedAnswers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(0)
            })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort oldest first
            
            setAnswers(fetchedAnswers.map(a => ({
              ...a,
              displayTimestamp: a.timestamp.toLocaleString()
            })));
        }, (error) => {
            console.error("Error fetching answers:", error);
        });

        return () => unsubscribe();
    }, [db, question.id, userId]); // FIX: Added userId to dependencies

    // 2. Handle Answer Submission
    const handleAnswerQuestion = async (e) => {
        e.preventDefault();
        if (!newAnswer.trim() || !db || !userId) return;

        setIsSubmittingAnswer(true);
        const answerText = newAnswer.trim();
        setNewAnswer('');

        try {
            const answersCollectionRef = collection(db, VIDEO_QA_PATH(appId, DEMO_VIDEO_ID), question.id, 'answers');
            await addDoc(answersCollectionRef, {
                text: answerText,
                userId: userId,
                timestamp: serverTimestamp(),
            });
        } catch (err) {
            console.error("Failed to add answer:", err);
        } finally {
            setIsSubmittingAnswer(false);
        }
    };

    return (
        <li key={question.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
            {/* Question Display */}
            <p className="font-medium text-gray-800 break-words mb-1">
                {/* Display formatted timestamp if available */}
                {formattedTime && (
                    <span className="inline-block px-2 py-0.5 mr-2 text-xs font-mono text-white bg-indigo-500 rounded-full">
                        @{formattedTime}
                    </span>
                )}
                {question.text}
            </p>
            <div className="text-xs text-gray-500 flex justify-between">
                <span className="font-medium text-indigo-500">User: {question.userId}</span>
                <span>{question.displayTimestamp}</span>
            </div>

            {/* Answers List */}
            {answers.length > 0 && (
                <div className="mt-3 ml-4 border-l pl-3 space-y-2">
                    {answers.map(answer => (
                        <div key={answer.id} className="text-sm bg-white p-2 rounded-md border border-gray-100">
                            <p className="text-gray-700">{answer.text}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Answered by <span className="font-semibold">{answer.userId}</span> at {answer.displayTimestamp}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Answer Toggle Button */}
            <button
                onClick={() => setIsAnswering(!isAnswering)}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                disabled={!isAuthReady}
            >
                {isAnswering ? 'Cancel Reply' : answers.length > 0 ? `View/Add Reply (${answers.length})` : 'Reply to Question'}
            </button>

            {/* Answer Input Form */}
            {isAnswering && isAuthReady && (
                <form onSubmit={handleAnswerQuestion} className="flex mt-3 gap-2">
                    <input
                        type="text"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:border-indigo-500 shadow-inner"
                        disabled={isSubmittingAnswer}
                    />
                    <button
                        type="submit"
                        disabled={!newAnswer.trim() || isSubmittingAnswer}
                        className={`px-3 py-1 text-sm rounded-lg text-white font-semibold transition ${
                            newAnswer.trim() && !isSubmittingAnswer
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isSubmittingAnswer ? "Sending..." : "Post Answer"}
                    </button>
                </form>
            )}
            {!isAuthReady && isAnswering && (
                <p className="mt-2 text-sm text-red-500">Authentication is required to post a reply.</p>
            )}
        </li>
    );
};

// --- Main Component ---

export default function VideoQA() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [newTimestamp, setNewTimestamp] = useState(""); // NEW: State for the timestamp
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Firebase State
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // 1. Initialize Firebase and Handle Authentication
    useEffect(() => {
        if (!firebaseConfig.apiKey) {
            console.error("Firebase config is missing.");
            setIsAuthReady(true);
            return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const auth = getAuth(app);
            
            setDb(firestore);

            const authUnsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    signInAnonymously(auth).then(anonUser => setUserId(anonUser.user.uid)).catch(console.error);
                }
                setIsAuthReady(true);
            });

            if (initialAuthToken) {
                signInWithCustomToken(auth, initialAuthToken).catch(error => {
                    console.warn("Custom token sign-in failed, falling back to anonymous:", error);
                    signInAnonymously(auth);
                });
            } else {
                signInAnonymously(auth);
            }

            return () => authUnsubscribe();

        } catch (error) {
            console.error("Firebase Initialization Error:", error);
            setIsAuthReady(true);
        }
    }, []);

    // 2. Load questions in real-time (onSnapshot)
    useEffect(() => {
        // FIX: Ensure userId is available before setting up the listener
        if (!isAuthReady || !db || !userId) return;

        const collectionPath = VIDEO_QA_PATH(appId, DEMO_VIDEO_ID);
        const q = query(collection(db, collectionPath));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedQuestions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp || 0, // Ensure timestamp is retrieved
                createdAt: doc.data().timestamp?.toDate() || new Date(0)
            })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort newest first
            
            setQuestions(fetchedQuestions.map(q => ({
              ...q,
              displayTimestamp: q.createdAt.toLocaleString()
            })));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching documents: ", error);
            setLoading(false);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [isAuthReady, db, userId]); // FIX: Added userId to dependencies


    // 3. Handle Question Submission
    const handleAddQuestion = async () => {
        if (!newQuestion.trim() || !db || !userId) return;

        setSubmitting(true);
        const questionText = newQuestion.trim();
        
        // Convert timestamp input to a number, defaulting to 0
        const timeInSeconds = parseFloat(newTimestamp) || 0; 
        
        setNewQuestion(""); // Clear input immediately for good UX
        setNewTimestamp("");

        try {
            const collectionPath = VIDEO_QA_PATH(appId, DEMO_VIDEO_ID);
            await addDoc(collection(db, collectionPath), {
                text: questionText,
                userId: userId,
                timestamp: timeInSeconds, // Save the numeric timestamp
                createdAt: serverTimestamp(), // Use a separate field for document creation time
            });
        } catch (err) {
            console.error("Failed to add question:", err);
            // Using a custom UI message instead of alert()
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthReady) {
        return (
            <div className="p-8 bg-gray-50 text-center rounded-xl shadow-md">
                <p className="text-lg font-medium text-indigo-600">Connecting to Q&A service...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-xl mx-auto mt-6 font-inter">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Video Q&A Section <span className="text-sm font-normal text-indigo-500">({DEMO_VIDEO_ID})</span>
            </h3>

            {/* Input Form */}
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-2">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={newTimestamp}
                        onChange={(e) => setNewTimestamp(e.target.value)}
                        placeholder="Time (sec)"
                        title="Time in seconds (e.g., 65 for 01:05)"
                        className="w-24 border-2 border-gray-200 rounded-lg px-2 py-2 text-sm focus:border-indigo-500 transition shadow-inner"
                        disabled={submitting}
                    />
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ask a question about this video..."
                        className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !submitting) handleAddQuestion();
                        }}
                        disabled={submitting}
                    />
                    <button
                        onClick={handleAddQuestion}
                        disabled={!newQuestion.trim() || submitting}
                        className={`px-4 py-2 rounded-lg font-semibold transition duration-150 ${
                            newQuestion.trim() && !submitting
                                ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {submitting ? "Submitting..." : "Ask"}
                    </button>
                </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-4 break-words">
                Authenticated as: <span className="font-mono text-indigo-600">{userId || "N/A"}</span>
            </div>


            {/* Question List */}
            <h4 className="text-lg font-semibold text-gray-700 mb-3 pt-3 border-t">
                {questions.length} Questions
            </h4>

            {loading ? (
                <p className="text-gray-500 p-4 text-center">Loading questions...</p>
            ) : questions.length === 0 ? (
                <p className="text-gray-500 p-4 text-center">No questions yet. Be the first!</p>
            ) : (
                <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {questions.map((q) => (
                        <QuestionItem 
                            key={q.id} 
                            question={q} 
                            db={db} 
                            userId={userId} 
                            isAuthReady={isAuthReady} 
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
