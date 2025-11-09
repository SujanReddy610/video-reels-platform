// // import Question from "../models/Question.js";
// // import Video from "../models/Video.js";
// // import User from "../models/User.js";

// // export const updateQnABadges = async () => {
// //   try {
// //     const users = await User.findAll();

// //     for (const user of users) {
// //       const questions = await Question.findAll({ where: { userId: user.id } });

// //       let validQnACount = 0;

// //       for (const question of questions) {
// //         const video = await Video.findByPk(question.videoId);
// //         if (!video) continue;

// //         if (video.description.toLowerCase().includes(question.text.toLowerCase())) {
// //           validQnACount += 1;
// //         }
// //       }

// //       if (validQnACount >= 5 && !user.badges.includes("Q&A Creator")) {
// //         user.badges.push("Q&A Creator");
// //         await user.save();
// //         console.log(`Badge awarded to ${user.username}`);
// //       }
// //     }
// //   } catch (error) {
// //     console.error("Error updating Q&A badges:", error);
// //   }
// // };
// // After successfully creating a question
// await updateQnABadges();





// badgeUtils.js
import Question from "../models/Question.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

export const updateQnABadges = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return;

    // Safely handle badges field
    const currentBadges = Array.isArray(user.badges) ? user.badges : [];

    // Count total questions posted by the user
    const totalQuestions = await Question.count({ where: { userId } });

    // Award badge if 5 or more questions and badge not already assigned
    if (totalQuestions >= 5 && !currentBadges.includes("Q&A Contributor")) {
      const updatedBadges = [...currentBadges, "Q&A Contributor"];
      await user.update({ badges: updatedBadges });
      console.log(`Badge awarded to ${user.username}`);
    }
  } catch (error) {
    console.error("Error updating Q&A badges:", error);
  }
};


export const calculateUserBadges = (user, userVideos = [], allQuestions = [], allVideos = []) => {
  if (!user) return [];

  const badges = [];
  const uploadCount = userVideos.length;
  const totalLikes = userVideos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const subscriberCount = user.subscriberCount || 0;

  // Upload badge
  if (uploadCount >= 30) badges.push({ name: "Master Creator 🌟", description: "Uploaded 30+ videos" });
  else if (uploadCount >= 15) badges.push({ name: "Pro Creator 🏅", description: "Uploaded 15+ videos" });
  else if (uploadCount >= 5) badges.push({ name: "Content Creator 🎥", description: "Uploaded 5+ videos" });

  // Likes badge
  if (totalLikes >= 500) badges.push({ name: "Audience Legend 🌟", description: "500+ likes" });
  else if (totalLikes >= 10) badges.push({ name: "Audience Champion 🏆", description: "150+ likes" });
  else if (totalLikes >= 5) badges.push({ name: "Audience Favorite 👍", description: "50+ likes" });

  // Subscribers badge
  if (subscriberCount >= 200) badges.push({ name: "Influencer 🚀", description: "200+ subscribers" });
  else if (subscriberCount >= 50) badges.push({ name: "Popular Creator ⭐", description: "50+ subscribers" });
  else if (subscriberCount >= 10) badges.push({ name: "Rising Star 🌟", description: "10+ subscribers" });

  // Q&A badges
  const userQuestions = allQuestions.filter(q => String(q.userId) === String(user.id));
  const questionCount = userQuestions.length;

  if (questionCount >= 15) badges.push({ name: "Q&A Expert 📚", description: "Posted 15+ questions" });
  else if (questionCount >= 5) badges.push({ name: "Curious Mind 💡", description: "Posted 5+ questions" });
  else if (questionCount >= 1) badges.push({ name: "Inquisitive 🧐", description: `Posted ${questionCount} question(s)` });

  // Keyword match with video descriptions
  const keywordMatched = allVideos.some(video =>
    userQuestions.some(q =>
      video.description?.toLowerCase().split(/\W+/).some(word =>
        q.text.toLowerCase().includes(word)
      )
    )
  );
  if (keywordMatched) badges.push({ name: "Description Matcher 📝", description: "Question matches video description keywords" });

  // Default badge if nothing
  if (badges.length === 0) badges.push({ name: "Newcomer 🐣", description: "Keep engaging to earn badges!" });

  return badges;
};