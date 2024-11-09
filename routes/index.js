import { Router } from 'express';

import sendConfirmationEmail from '../service/mailService.js';
import upload from '../service/CloudinaryService.js';
import db from '../utils/db.js'
import newsPaperService from '../service/news-paperService.js';
import saveUserToDatabase from '../service/userService.js';


const router = Router();

// CHeck role

const roleBasedAccess = (requiredRole) => (req, res, next) => {
  if (req.session.role === requiredRole) {
    return next();
  }
  res.status(403).send('Access Denied');
};





router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [newUserId] = await db('users').insert({
      email,
      password: hashedPassword,
      name,
      role: 'user', // Default role as 'user'
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUserId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

    // Store user ID and role in session
    req.session.userId = user.id;
    req.session.role = user.role;

    // Set role cookie
    res.cookie('userRole', user.role, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/login', (req,res) => { res.render('login', {layout: false} )
});


router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
  });
});




router.get('/', (req, res) => {
  const userGreeting = req.user ? `<h1>Hello ${req.user.displayName}</h1>` : '<h1>Hello Guest</h1>';
  const loginLink = req.user ? 
      `<a href="/logout" class="btn btn-danger">Logout</a>` : 
      `<a href="/login" class="btn btn-primary">Login </a>`;

  res.send(`
      <div style="text-align: center; margin-top: 50px;">
          ${userGreeting}
          <div style="margin-top: 20px;">
              ${loginLink}
          </div>
      </div>
  `);
});


router.post('/send-confirmation', async (req, res) => {
  const { email } = req.body;
  const confirmationCode = Math.floor(100000 + Math.random() * 900000); // Mã 6 chữ số
  await sendConfirmationEmail(email, confirmationCode);
  res.status(200).json({ message: 'Email xác nhận đã được gửi', confirmationCode });
});



router.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.send({ imageUrl: req.file.path }); 
});


router.post('/save-article', async (req, res) => {
  const { title, content } = req.body;
  const ret = await newsPaperService.add(title, content)
  if(ret!== undefined) {
    res.send('Bài viết đã được lưu thành công!');
  }
  else {
    return res.status(500).send('Lỗi khi lưu bài viết!');
  }

});



router.get('/get-article/:id', (req, res) => {
  const articleId = req.params.id;
  
  const query = 'SELECT title, content FROM articles WHERE id = ?';
  db.query(query, [articleId], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy bài viết:', err);
      return res.status(500).send('Lỗi khi lấy bài viết!');
    }
    if (results.length > 0) {
      res.json(results[0]); // Trả về bài viết đầu tiên
    } else {
      res.status(404).send('Không tìm thấy bài viết!');
    }
  });
});






export default router;