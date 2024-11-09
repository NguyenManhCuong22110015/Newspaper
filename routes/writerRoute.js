import { Router } from 'express';

import articleService from '../service/articleService.js';

const router = Router();


router.get('/articles', async (req, res) => {

    // const userID = req.session.userId;
    const userID = 6;
     const list = await articleService.getArticlesByWriterID(userID);
   
     res.render('writer/list-articles', {layout: "nav-bar-admin", list : list});
   });



   router.get('/add-article', (req,res) => {
    res.render('writer/add-article')
  });


  router.get('/edit-article', async (req,res) => {

    const id = +req.query.id || 0;
  
    const article = await articleService.getArticleByID(id);
  
    res.render('writer/edit-article', {data: {
      title: article.title,
      summary: article.summary,
      content: JSON.stringify(article.content)  
  }});
  });
  
   export default router;

