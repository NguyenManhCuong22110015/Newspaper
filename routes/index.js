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







router.get('/login', (req,res) => { res.render('login', {layout: false} )
});


router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    
    // Xóa toàn bộ session
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
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