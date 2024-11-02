import { Router } from 'express';
import facebookPassport from '../authentication/facebook.js';
import googlePassport from '../authentication/google.js';
import githubPassport from '../authentication/github.js';
import sendConfirmationEmail from '../service/mailService.js';
import upload from '../service/CloudinaryService.js';
import db from '../utils/db.js'
import newsPaperService from '../service/news-paperService.js';



const router = Router();


router.get('/auth/facebook', facebookPassport.authenticate('facebook',{auth_type: 'reauthenticate'} ));
router.get(
  '/auth/facebook/callback',
  facebookPassport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);


router.get('/auth/google',googlePassport.authenticate('google', { scope: ['profile', 'email'] ,prompt: 'select_account' }));
router.get('/auth/google/callback',googlePassport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);


router.get('/login', (req,res) => { res.render('login', {layout: false} )
});
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
  });
});


router.get('/edit', (req,res) => {
  res.render('edit', {layout: false} )
});



router.get( '/auth/github',(req, res, next) => {req.logout((err) => {
        if (err) return next(err);
        next();
      }); 
    },
    githubPassport.authenticate('github', { scope: ['user:email'] })
  );
  
router.get( '/auth/github/callback', githubPassport.authenticate('github', { failureRedirect: '/login' }),(req, res) => res.redirect('/')
);




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