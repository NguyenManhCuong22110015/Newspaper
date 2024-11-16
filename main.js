import express from 'express';
import passport from 'passport';
import session from 'express-session'
import './authentication/passport-setup.js'
import { engine } from 'express-handlebars'; 
import path from 'path';
import { fileURLToPath } from 'url';
import facebookPassport from './authentication/facebook.js';
import googlePassport from './authentication/google.js';
import router from './routes/index.js';
import githubPassport from './authentication/github.js';
import flash from 'connect-flash';
const app = express()


   app.engine('hbs', engine({
    extname : 'hbs',
    
  }));
  app.set('view engine', 'hbs');
  app.set('views', './view');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use(session({
      secret: 'Q2VNTVN3QklsQXZTRmFhRHV6ZEtKcHhDdFNldG4xTHdGSzRCWkunSmJ5UT8',
      resave: false,
      saveUninitialized: true,
  }));
  router.use((req, res, next) => {
    if (req.session.user) {
      req.user = req.session.user;
    }
    next();
  });
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.errorMessage = req.flash('error');
    next();
});
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json()); 
  app.use(facebookPassport.initialize());
  app.use(facebookPassport.session());
  app.use(googlePassport.initialize());
  app.use(googlePassport.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(githubPassport.initialize());
  app.use(githubPassport.session());
  app.use('/', router);
  

import authLogin from  './routes/authLoginRoute.js';

app.use('/auth', authLogin);

import writerRoute from  './routes/writerRoute.js';

app.use('/writer', writerRoute);

import adminRoute from  './routes/adminRoute.js';

app.use('/admin', adminRoute);

app.get("/", (req, res) => {
    res.send("Hello word")
})





app.listen(3000, ()  => {
    console.log("App is running")
})