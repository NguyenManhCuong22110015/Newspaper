import db from '../utils/db.js';

export default {
    async getArticlesByWriterID(userID){

        const list = await db('writer_article').where('writer_id', userID)
        
        const articleIds = list.map(item => item.article_id);

        return db('articles').whereIn('id', articleIds);
    },

    getArticleByID(id) {
        return db('articles').where('id', id).first();
    }
}