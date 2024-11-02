import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';  
dotenv.config(); 

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Tìm người dùng trong DB (nếu có)
    done(null, { id });
});

passport.use(new GoogleStrategy({
    clientID: process.env.PASSPORT_CLIENT_ID,
    clientSecret: process.env.PASSPORT_CLIENT_SECRET,
    callbackURL: process.env.PASSPORT_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    // Lưu thông tin người dùng vào DB hoặc xử lý theo nhu cầu
    done(null, profile);
}));
