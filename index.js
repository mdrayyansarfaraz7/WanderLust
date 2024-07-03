if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const listings=require('./routes/listings.js');
const reviews=require('./routes/reviews.js');
const user=require('./routes/user.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const localStratergy=require('passport-local');
const User=require('./models/users.js');




const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const DBurl=process.env.ATLASDB_URL;


const store=MongoStore.create({
    mongoUrl:DBurl,
    crypto:{
        secret:process.env.SECREAT,
    },
    touchAfter:24*60*60
})

store.on("error",()=>{
    console.log("error in express sessions:",err)
})

const sessionOptions={
    store,
    secret:process.env.SECREAT,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000
    }
}





mongoose.connect(DBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected!");
}).catch(err => {
    console.log("DB Connection Error:", err);
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

app.get('/demo',async(req,res)=>{
    let fakeUser=new User({
        email:"fakeruser@gmail.com",
        username:"Fake2"
    });
    let person= await User.register(fakeUser,"12354");
    res.send(person);

})

app.use('/',user);
app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews);



app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Oops! Something went wrong..." } = err;
    res.status(status).render('error', { message });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});