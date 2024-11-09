import db from '../utils/db.js';


  const saveUserToDatabase = async (profile, provider) => {
    const { id: oauth_id, displayName, emails } = profile;
    const email = emails && emails[0].value;
  
    try {
      // Check if user already exists
      const user = await db('users').where({ oauth_id, provider }).first();
  
      if (!user) {
        // Insert new user if they don't exist
        const [newUserId] = await db('users').insert({  
          oauth_id,
          provider,
          name: displayName,
          email,
          role: 'user', // Default role as 'user'
        });
        return { id: newUserId, role: 'user' };
      } else {
        // User exists, return existing data
        return user;
      }
    } catch (err) {
      console.error('Database error:', err);
      throw err;
    }
  };
  

export default saveUserToDatabase;
