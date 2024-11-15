import db from "../utils/db.js";

export default {
    add(title, content, summary, category, tags, userId) {
        
        return db("articles").insert({
            title: title,
            summary: summary,
            content: content
        })
        .then(() => {
            return db("articles").select("id").orderBy("id", "desc").limit(1);
        })
        .then(([newArticle]) => {
            const newArticleId = newArticle.id; 
            return db("writer_article").insert({
                writer_id: userId,
                article_id: newArticleId
            });
        });
    },
    update(id,title, content, summary, category, tags, userId) {
        return db("articles").update({
            title: title,
            summary: summary,
            content: content
        }).where("id", id)
        
    }
};
