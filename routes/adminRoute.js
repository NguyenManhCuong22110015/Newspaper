import { Router } from 'express';
const router = Router();

router.get('/categories', async (req, res) => {

     
    
   
     res.render('admin/categories', {layout: "nav-bar-admin"});
});



router.get('/tags', async (req, res) => {

   
    res.render('admin/tags', {layout: "nav-bar-admin"});
});


router.get('/articles', async (req, res) => {

   
    res.render('admin/articles', {layout: "nav-bar-admin"});
});

router.get('/users', async (req, res) => {

   
    res.render('admin/users', {layout: "nav-bar-admin"});
});





export default router;