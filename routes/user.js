let express=require('express');
let router=express.Router();
let User=require('../models/users.js');
const passport = require('passport');
const { saveRedirectionPath } = require('../middleware.js');

router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
    
});
router.post('/signup',async (req,res,next)=>{
    try{
        let {username , password,email}=req.body;

        let newUser=new User({username,email});
        let registeredUser= await User.register(newUser,password);
    
        console.log(registeredUser);
        req.login(registeredUser,(error)=>{
            if(error){
                return next(error)
            }
            req.flash("success","You are Registered successfully...Welcome to WanderLust!")
            res.redirect('/listings');
        })
       
    }catch(err){
        req.flash("error",err.message);
        res.redirect('/signup');
    }
   
    

})

router.get('/login',(req,res)=>{
    res.render("users/login.ejs");
})

router.post('/login',
    saveRedirectionPath
    ,
    passport.authenticate("local",
        {
            failureRedirect:'/login',
            failureFlash:true
        }),async (req,res)=>{
        req.flash("success","Welcome back to WanderLust!")
        let redirection=res.locals.redirectUrl||'/listings'
        res.redirect(redirection);
})

router.get('/logout',(req,res,next)=>{
    req.logout((error)=>{
        if(error){
            return next(error);
        }
        req.flash("success","you are logged out!");
        res.redirect('/listings');
    })
})

module.exports=router;