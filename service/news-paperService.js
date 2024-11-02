import db from "../utils/db.js";

export default {
    add(title, content) {
        return db("articles").insert({
            title: title,
            content: content
        });
    }
}
