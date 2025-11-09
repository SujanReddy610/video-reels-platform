
// workig code
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// // REGISTER
// export const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

//   try {
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) return res.status(409).json({ message: 'Email already registered' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashedPassword });
//     const { password: _, ...userData } = user.toJSON();
//     res.status(201).json({ message: 'User created successfully', user: userData });
//   } catch (err) {
//     res.status(500).json({ message: 'Registration failed', error: err.message });
//   }
// };

// // LOGIN
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     const { password: _, ...userData } = user.toJSON();
//     res.status(200).json({ message: 'Login successful', token, user: userData });
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// };

// // GET CURRENT USER
// export const getMe = async (req, res) => {
//   try {
//     const { password, ...userData } = req.user.toJSON();
//     res.status(200).json({ user: userData });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to get user', error: err.message });
//   }
// };




import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js'; // ✅ Import Subscription

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const { password: _, ...userData } = user.toJSON();
    res
      .status(201)
      .json({ message: 'User created successfully', user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    const { password: _, ...userData } = user.toJSON();
    res.status(200).json({ message: 'Login successful', token, user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const userId = req.user.id;

    // Count subscribers
    let subscriberCount = 0;
    try {
      subscriberCount = await Subscription.count({ where: { subscribedToId: userId } });
    } catch (err) {
      console.error('Subscription count failed', err);
    }

    // Exclude password
    const { password, ...userData } = req.user.toJSON();

    res.status(200).json({ user: { ...userData, subscriberCount } });
  } catch (err) {
    console.error('GetMe error', err);
    res.status(500).json({ message: 'Failed to get user', error: err.message });
  }
};
