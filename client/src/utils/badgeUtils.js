

/**
 * Calculate badges for a user based on videos, likes, subscribers, and questions.
//  * @param {Object} user - The user object
//  * @param {Array} userVideos - Array of videos uploaded by the user
//  * @param {Array} allQuestions - Array of all questions globally
//  * @param {Array} allVideos - Array of all videos globally
//  * @returns {Array} badges - Array of badge objects { name, description }
//  */
// export const calculateUserBadges = (user, userVideos, allQuestions, allVideos) => {
//   if (!user) return [];

//   const badges = [];

//   // Counts
//   const uploadCount = userVideos.length;
//   const totalLikes = userVideos.reduce((sum, v) => sum + (v.likes || 0), 0);
//   const subscriberCount = user.subscriberCount || 0;

//   // ---------------- Upload Badges ----------------
// //   if (uploadCount >= 30) badges.push({ name: "Master Creator 🌟", description: "Uploaded 30+ videos" });
// //   else if (uploadCount >= 15) badges.push({ name: "Pro Creator 🏅", description: "Uploaded 15+ videos" });
// //   else if (uploadCount >= 5) badges.push({ name: "Content Creator 🎥", description: "Uploaded 5+ videos" });
// if (uploadCount >= 30)
//     badges.push({ name: "Master Creator 🌟", description: `Uploaded ${uploadCount} videos` });
//   else if (uploadCount >= 15)
//     badges.push({ name: "Pro Creator 🏅", description: `Uploaded ${uploadCount} videos` });
//   else if (uploadCount >= 5)
//     badges.push({ name: "Content Creator 🎥", description: `Uploaded ${uploadCount} videos` });
//   else if (uploadCount > 0)
//     badges.push({ name: "New Uploader 🆕", description: `Uploaded ${uploadCount} video(s)` });

//   // ---------------- Likes Badges ----------------
// //   if (totalLikes >= 500) badges.push({ name: "Audience Legend 🌟", description: "500+ likes" });
// //   else if (totalLikes >= 150) badges.push({ name: "Audience Champion 🏆", description: "150+ likes" });
// //   else if (totalLikes >= 5) badges.push({ name: "Audience Favorite 👍", description: "50+ likes" });
// if (totalLikes >= 500)
//     badges.push({ name: "Audience Legend 🌟", description: `${totalLikes}+ total likes` });
//   else if (totalLikes >= 150)
//     badges.push({ name: "Audience Champion 🏆", description: `${totalLikes}+ total likes` });
//   else if (totalLikes >= 50)
//     badges.push({ name: "Audience Favorite 👍", description: `${totalLikes}+ total likes` });
//   else if (totalLikes > 0)
//     badges.push({ name: "Liked Creator 💖", description: `${totalLikes} total likes` });

//   // ---------------- Subscribers Badges ----------------
// //   if (subscriberCount >= 200) badges.push({ name: "Influencer 🚀", description: "200+ subscribers" });
// //   else if (subscriberCount >= 50) badges.push({ name: "Popular Creator ⭐", description: "50+ subscribers" });
// //   else if (subscriberCount >= 1) badges.push({ name: "Rising Star 🌟", description: "10+ subscribers" });
// const subscriberCountNum = Number(user.subscriberCount || 0);

// if (subscriberCountNum >= 200)
//   badges.push({ name: "Influencer 🚀", description: "200+ subscribers" });
// else if (subscriberCountNum >= 50)
//   badges.push({ name: "Popular Creator ⭐", description: "50+ subscribers" });
// else if (subscriberCountNum >= 1)
//   badges.push({ name: "Rising Star 🌟", description: `${subscriberCountNum}+ subscribers` });


//   // ---------------- Q&A Badges ----------------
//   const userQuestions = allQuestions.filter(q => String(q.userId) === String(user.id));
//   const questionCount = userQuestions.length;

// //   if (questionCount >= 15) badges.push({ name: "Q&A Expert 📚", description: "Posted 15+ questions" });
// //   else if (questionCount >= 5) badges.push({ name: "Curious Mind 💡", description: "Posted 5+ questions" });
// //   else if (questionCount >= 1) badges.push({ name: "Inquisitive 🧐", description: `Posted ${questionCount} question(s)` });
// // const userQuestions = allQuestions.filter(q => String(q.userId) === String(user.id));
// //   const questionCount = userQuestions.length;

//   if (questionCount >= 15)
//     badges.push({ name: "Q&A Expert 📚", description: `Posted ${questionCount}+ questions` });
//   else if (questionCount >= 5)
//     badges.push({ name: "Curious Mind 💡", description: `Posted ${questionCount} questions` });
//   else if (questionCount >= 1)
//     badges.push({ name: "Inquisitive 🧐", description: `Posted ${questionCount} question(s)` });

//   // ---------------- Keyword Match Badge ----------------
//   const keywordMatched = allVideos.some(video =>
//     userQuestions.some(q =>
//       video.description?.toLowerCase().split(/\W+/).some(word =>
//         q.text.toLowerCase().includes(word)
//       )
//     )
//   );
//   if (keywordMatched) badges.push({ name: "Description Matcher 📝", description: "Question matches video description keywords" });

//   // ---------------- Default Badge ----------------
//   if (badges.length === 0) badges.push({ name: "Newcomer 🐣", description: "Keep engaging to earn badges!" });

//   return badges;
// };



// // to display points
/**
 /**
 * Calculate badges and points for a user based on videos, likes, subscribers, and questions.
 * @param {Object} user - The user object
 * @param {Array} userVideos - Array of videos uploaded by the user
 * @param {Array} allQuestions - Array of all questions globally
 * @param {Array} allVideos - Array of all videos globally
 * @returns {Object} { badges: Array, points: Number, batchPoints: Object }
 */
export const calculateUserBadges = (user, userVideos, allQuestions, allVideos) => {
  if (!user) return { badges: [], points: 0, batchPoints: {} };

  const badges = [];

  // ---------------- Counts ----------------
  const uploadCount = userVideos.length;
  const totalLikes = userVideos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const subscriberCount = Number(user.subscriberCount || 0);
  const userQuestions = allQuestions.filter(
    (q) => String(q.userId) === String(user.id)
  );
  const questionCount = userQuestions.length;

  // ---------------- Initialize batch points ----------------
  const batchPoints = {
    uploads: { points: 0, count: uploadCount },
    likes: { points: 0, count: totalLikes },
    subscribers: { points: 0, count: subscriberCount },
    questions: { points: 0, count: questionCount },
    keywordMatch: { points: 0, count: 0 },
  };

  // ---------------- Upload Badges ----------------
  if (uploadCount >= 30) {
    const points = uploadCount * 5;
    badges.push({
      name: "Master Creator 🌟",
      description: `Uploaded ${uploadCount} videos`,
      points,
    });
    batchPoints.uploads.points = points;
  } else if (uploadCount >= 15) {
    const points = uploadCount * 5;
    badges.push({
      name: "Pro Creator 🏅",
      description: `Uploaded ${uploadCount} videos`,
      points,
    });
    batchPoints.uploads.points = points;
  } else if (uploadCount >= 5) {
    const points = uploadCount * 5;
    badges.push({
      name: "Content Creator 🎥",
      description: `Uploaded ${uploadCount} videos`,
      points,
    });
    batchPoints.uploads.points = points;
  } else if (uploadCount > 0) {
    const points = uploadCount * 5;
    badges.push({
      name: "New Uploader 🆕",
      description: `Uploaded ${uploadCount} video(s)`,
      points,
    });
    batchPoints.uploads.points = points;
  }

  // ---------------- Likes Badges ----------------
  if (totalLikes >= 500) {
    const points = totalLikes * 1;
    badges.push({
      name: "Audience Legend 🌟",
      description: `${totalLikes}+ total likes`,
      points,
    });
    batchPoints.likes.points = points;
  } else if (totalLikes >= 150) {
    const points = totalLikes * 1;
    badges.push({
      name: "Audience Champion 🏆",
      description: `${totalLikes}+ total likes`,
      points,
    });
    batchPoints.likes.points = points;
  } else if (totalLikes >= 50) {
    const points = totalLikes * 1;
    badges.push({
      name: "Audience Favorite 👍",
      description: `${totalLikes}+ total likes`,
      points,
    });
    batchPoints.likes.points = points;
  } else if (totalLikes >= 1) {
    const points = totalLikes * 1;
    badges.push({
      name: "Liked Creator 💖",
      description: `${totalLikes}+ total likes`,
      points,
    });
    batchPoints.likes.points = points;
  }

  // ---------------- Subscribers Badges ----------------
  if (subscriberCount >= 200) {
    const points = subscriberCount * 2;
    badges.push({
      name: "Influencer 🚀",
      description: "200+ subscribers",
      points,
    });
    batchPoints.subscribers.points = points;
  } else if (subscriberCount >= 50) {
    const points = subscriberCount * 2;
    badges.push({
      name: "Popular Creator ⭐",
      description: "50+ subscribers",
      points,
    });
    batchPoints.subscribers.points = points;
  } else if (subscriberCount >= 1) {
    const points = subscriberCount * 2;
    badges.push({
      name: "Rising Star 🌟",
      description: `${subscriberCount}+ subscribers`,
      points,
    });
    batchPoints.subscribers.points = points;
  }

  // ---------------- Q&A Badges ----------------
  if (questionCount >= 15) {
    const points = questionCount * 3;
    badges.push({
      name: "Q&A Expert 📚",
      description: `Posted ${questionCount}+ questions`,
      points,
    });
    batchPoints.questions.points = points;
  } else if (questionCount >= 5) {
    const points = questionCount * 3;
    badges.push({
      name: "Curious Mind 💡",
      description: `Posted ${questionCount} questions`,
      points,
    });
    batchPoints.questions.points = points;
  } else if (questionCount >= 1) {
    const points = questionCount * 3;
    badges.push({
      name: "Inquisitive 🧐",
      description: `Posted ${questionCount} question(s)`,
      points,
    });
    batchPoints.questions.points = points;
  }

  // ---------------- Keyword Match Badge ----------------
  const keywordMatched = allVideos.some((video) =>
    userQuestions.some((q) =>
      video.description
        ?.toLowerCase()
        .split(/\W+/)
        .some((word) => q.text.toLowerCase().includes(word))
    )
  );

  if (keywordMatched) {
    const points = 10;
    badges.push({
      name: "Description Matcher 📝",
      description: "Question matches video description keywords",
      points,
    });
    batchPoints.keywordMatch.points = points;
  }

  // ---------------- Default Badge ----------------
  if (badges.length === 0) {
    badges.push({
      name: "Newcomer 🐣",
      description: "Keep engaging to earn badges!",
      points: 0,
    });
  }

  // ---------------- Calculate Total Points ----------------
  const totalPoints = Object.values(batchPoints).reduce((sum, val) => {
    if (typeof val === "object" && val !== null) {
      return sum + (val.points || 0);
    }
    return sum + val;
  }, 0);

  // ✅ Return all computed values
  return { badges, points: totalPoints, batchPoints };
};
