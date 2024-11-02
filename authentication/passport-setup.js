import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Tìm người dùng trong DB (nếu có)
    done(null, { id });
});

passport.use(new GoogleStrategy({
    clientID: '545441830130-9hkn13rd4l8a8vjso6bl6kebfitbcqen.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    // Lưu thông tin người dùng vào DB hoặc xử lý theo nhu cầu
    done(null, profile);
}));
