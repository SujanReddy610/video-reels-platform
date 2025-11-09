// working code
// import User from '../models/User.js'; // Your Sequelize User model

// // Get all users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({
//       attributes: ['id', 'name', 'email'], // only send necessary info
//     });
//     res.status(200).json(users);
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).json({ message: 'Failed to fetch users', error: err.message });
//   }
// };


// // controllers/userController.js
// import User from '../models/User.js';
// import Subscription from '../models/Subscription.js'; // your subscription table

// // Fetch all users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({ attributes: ['id', 'name'] });
//     res.status(200).json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch users', error: err.message });
//   }
// };

// // Fetch subscribed users for a given user
// export const getSubscribedUsers = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const subscriptions = await Subscription.findAll({
//       where: { subscriberId: userId }, // assuming this column exists
//       include: [{ model: User, as: 'subscribedTo', attributes: ['id', 'name'] }]
//     });

//     const subscribedUsers = subscriptions.map(sub => sub.subscribedTo);
//     res.status(200).json(subscribedUsers);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch subscribed users', error: err.message });
//   }
// };




























// temporary code for message fetch
// controllers/userController.js
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';

// ---------------------
// Fetch all users
// ---------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name'] });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// ---------------------
// Fetch subscribed users for a given user
// ---------------------
export const getSubscribedUsers = async (req, res) => {
  const { userId } = req.params;
  try {
    const subscriptions = await Subscription.findAll({
      where: { subscriberId: userId },
      include: [{ model: User, as: 'subscribedTo', attributes: ['id', 'name'] }]
    });

    const subscribedUsers = subscriptions.map(sub => sub.subscribedTo);
    res.status(200).json(subscribedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch subscribed users', error: err.message });
  }
};

// ---------------------
// Fetch chat connections for a user
// Returns: video owner + users subscribed by the current user + users subscribed to the current user
// ---------------------
export const getUserConnections = async (req, res) => {
  try {
    const { userId, targetUserId } = req.params; // targetUserId = user whose video Sujan clicked

    // 1️⃣ User Sujan clicked (video owner)
    const targetUser = await User.findByPk(targetUserId, { attributes: ['id', 'name'] });

    // 2️⃣ Users Sujan subscribed to
    const subscriptions = await Subscription.findAll({
      where: { subscriberId: userId },
      include: [{ model: User, as: 'subscribedTo', attributes: ['id', 'name'] }]
    });
    const subscribedUsers = subscriptions.map(sub => sub.subscribedTo);

    // 3️⃣ Users subscribed to Sujan
    const subscribers = await Subscription.findAll({
      where: { subscribedToId: userId },
      include: [{ model: User, as: 'subscriber', attributes: ['id', 'name'] }]
    });
    const subscribedToMeUsers = subscribers.map(sub => sub.subscriber);

    // Merge all users + targetUser, remove duplicates
    const allUsers = [
      targetUser,
      ...subscribedUsers,
      ...subscribedToMeUsers
    ];

    const uniqueUsersMap = {};
    allUsers.forEach(user => {
      if (user && !uniqueUsersMap[user.id]) {
        uniqueUsersMap[user.id] = user;
      }
    });

    const uniqueUsers = Object.values(uniqueUsersMap);

    res.status(200).json(uniqueUsers);
  } catch (err) {
    console.error('Error fetching user connections:', err);
    res.status(500).json({ message: 'Failed to fetch connections', error: err.message });
  }
};
