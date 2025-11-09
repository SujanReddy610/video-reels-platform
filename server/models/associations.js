

// // privacy video setting
// // ----------------- models/associations.js -----------------
// import User from './User.js';
// import Video from './Video.js';
// import VideoComment from './VideoComment.js';
// import VideoReaction from './VideoReaction.js';
// import VideoView from './VideoView.js';
// import Question from './Question.js';
// import Answer from './Answer.js';
// import Badge from './Badge.js';
// import ChatGroup from "./ChatGroup.js";
// import ChatMessage from "./ChatMessage.js";

// // ---------------- USER & VIDEO ----------------
// User.hasMany(Video, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Video.belongsTo(User, { foreignKey: 'userId' });

// // ---------------- VIDEO & COMMENTS ----------------
// Video.hasMany(VideoComment, { foreignKey: 'videoId', onDelete: 'CASCADE' });
// VideoComment.belongsTo(Video, { foreignKey: 'videoId' });

// User.hasMany(VideoComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
// VideoComment.belongsTo(User, { foreignKey: 'userId' });

// // ---------------- VIDEO & REACTIONS ----------------
// Video.hasMany(VideoReaction, { foreignKey: 'videoId', onDelete: 'CASCADE' });
// VideoReaction.belongsTo(Video, { foreignKey: 'videoId' });

// User.hasMany(VideoReaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
// VideoReaction.belongsTo(User, { foreignKey: 'userId' });

// // ---------------- VIDEO & VIEWS ----------------
// Video.hasMany(VideoView, { foreignKey: 'videoId', onDelete: 'CASCADE' });
// VideoView.belongsTo(Video, { foreignKey: 'videoId' });

// User.hasMany(VideoView, { foreignKey: 'userId', onDelete: 'CASCADE' });
// VideoView.belongsTo(User, { foreignKey: 'userId' });

// // ---------------- USER & QUESTIONS ----------------
// User.hasMany(Question, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Question.belongsTo(User, { foreignKey: 'userId', as: 'asker' });

// // ---------------- VIDEO & QUESTIONS ----------------
// Video.hasMany(Question, { foreignKey: 'videoId', onDelete: 'CASCADE' });
// Question.belongsTo(Video, { foreignKey: 'videoId' });

// // ---------------- QUESTION & ANSWERS ----------------
// Question.hasMany(Answer, { foreignKey: 'questionId', onDelete: 'CASCADE', as: 'responses' });
// Answer.belongsTo(Question, { foreignKey: 'questionId' });

// // ---------------- USER & ANSWERS ----------------
// User.hasMany(Answer, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Answer.belongsTo(User, { foreignKey: 'userId', as: 'answerer' });

// // ---------------- USER & BADGE ----------------
// User.hasOne(Badge, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Badge.belongsTo(User, { foreignKey: 'userId' });

// ChatGroup.belongsToMany(User, { through: "ChatGroupUsers", as: "members" });
// User.belongsToMany(ChatGroup, { through: "ChatGroupUsers", as: "groups" });

// // One-to-Many: group → messages
// // One-to-Many: group → messages
// // ---------------- CHAT GROUP & MESSAGES ----------------
// ChatGroup.hasMany(ChatMessage, { foreignKey: "groupId", as: "messages" });
// ChatMessage.belongsTo(ChatGroup, { foreignKey: "groupId", as: "chatGroup" });

// // ---------------- CHAT MESSAGE & USER ----------------
// User.hasMany(ChatMessage, { foreignKey: "senderId", as: "sentMessages" });
// ChatMessage.belongsTo(User, { foreignKey: "senderId", as: "senderUser" });




// // ---------------- EXPORT MODELS ----------------
// export {
//   User,
//   ChatGroup, 
//   ChatMessage,
//   Video,
//   VideoComment,
//   VideoReaction,
//   VideoView,
//   Question,
//   Answer,
//   Badge
// };

// ----------------- models/associations.js -----------------
import User from './User.js';
import Video from './Video.js';
import VideoComment from './VideoComment.js';
import VideoReaction from './VideoReaction.js';
import VideoView from './VideoView.js';
import Question from './Question.js';
import Answer from './Answer.js';
import Badge from './Badge.js';
import ChatGroup from "./ChatGroup.js";
import ChatMessage from "./ChatMessage.js";

// ---------------- USER & VIDEO ----------------
User.hasMany(Video, { foreignKey: 'userId', onDelete: 'CASCADE' });
Video.belongsTo(User, { foreignKey: 'userId' });

// ---------------- VIDEO & COMMENTS ----------------
Video.hasMany(VideoComment, { foreignKey: 'videoId', onDelete: 'CASCADE' });
VideoComment.belongsTo(Video, { foreignKey: 'videoId' });

User.hasMany(VideoComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
VideoComment.belongsTo(User, { foreignKey: 'userId' });

// ---------------- VIDEO & REACTIONS ----------------
Video.hasMany(VideoReaction, { foreignKey: 'videoId', onDelete: 'CASCADE' });
VideoReaction.belongsTo(Video, { foreignKey: 'videoId' });

User.hasMany(VideoReaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
VideoReaction.belongsTo(User, { foreignKey: 'userId' });

// ---------------- VIDEO & VIEWS ----------------
Video.hasMany(VideoView, { foreignKey: 'videoId', onDelete: 'CASCADE' });
VideoView.belongsTo(Video, { foreignKey: 'videoId' });

User.hasMany(VideoView, { foreignKey: 'userId', onDelete: 'CASCADE' });
VideoView.belongsTo(User, { foreignKey: 'userId' });

// ---------------- USER & QUESTIONS ----------------
User.hasMany(Question, { foreignKey: 'userId', onDelete: 'CASCADE' });
Question.belongsTo(User, { foreignKey: 'userId', as: 'asker' });

// ---------------- VIDEO & QUESTIONS ----------------
Video.hasMany(Question, { foreignKey: 'videoId', onDelete: 'CASCADE' });
Question.belongsTo(Video, { foreignKey: 'videoId' });

// ---------------- QUESTION & ANSWERS ----------------
Question.hasMany(Answer, { foreignKey: 'questionId', onDelete: 'CASCADE', as: 'responses' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

// ---------------- USER & ANSWERS ----------------
User.hasMany(Answer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Answer.belongsTo(User, { foreignKey: 'userId', as: 'answerer' });

// ---------------- USER & BADGE ----------------
User.hasOne(Badge, { foreignKey: 'userId', onDelete: 'CASCADE' });
Badge.belongsTo(User, { foreignKey: 'userId' });

ChatGroup.belongsToMany(User, { through: "ChatGroupUsers", as: "members" });
User.belongsToMany(ChatGroup, { through: "ChatGroupUsers", as: "groups" });

// One-to-Many: group → messages
// One-to-Many: group → messages
// ---------------- CHAT GROUP & MESSAGES ----------------
ChatGroup.hasMany(ChatMessage, { foreignKey: "groupId", as: "messages" });
ChatMessage.belongsTo(ChatGroup, { foreignKey: "groupId", as: "chatGroup" });

// ---------------- CHAT MESSAGE & USER ----------------
User.hasMany(ChatMessage, { foreignKey: "senderId", as: "sentMessages" });
ChatMessage.belongsTo(User, { foreignKey: "senderId", as: "senderUser" });




// ---------------- EXPORT MODELS ----------------
export {
  User,
  ChatGroup, 
  ChatMessage,
  Video,
  VideoComment,
  VideoReaction,
  VideoView,
  Question,
  Answer,
  Badge
};




