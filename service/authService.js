import db from '../utils/db.js';
import bcrypt from 'bcrypt';

export default {
    async login(email, password) {
        const user = await db('users').where({ email }).first();
        if (!user) return null; // Trả về null nếu không tìm thấy user

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return null; // Trả về null nếu mật khẩu không đúng

        return user; 
    },

    async checkAccountOrCreateAccount(email, password) {
        const user = await db('users').where({ email }).first();

        if (user) {return null}

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user with the hashed password
        return db('users').insert({ email: email, password: hashedPassword, name: email  });
        

    }
};
