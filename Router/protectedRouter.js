const { Router } = require("express");
const router = Router();
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protectedPostController = require("../Controllers/protectedPostController")
const commentController = require("../Controllers/commentController")
const asyncHandler = require("express-async-handler");


//extended Router for BlogAuthor 
//baseURl "/blogAuthor"


passport.use(
    'jwt',
    new JWTstrategy(
        {
            secretOrKey: process.env.SECRET_KEY,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            // console.log("TOKEN FROM JWT STRATEGY")
            // console.log(token)
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'login', 
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email , password , done ) =>{
            // console.log("PASSPORT LOCAL STRATEGY  : ")
            // console.log(email)
            // console.log(password)
            try {
                const user = await prisma.user.findUnique({
                  where: {
                    email : email
                  },
                })

                // console.log("USER FROM LOCAL STRATEGY : ")
                // console.log(user)
                if (!user) {
                  return done(null, false, { message: "Incorrect username" });
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                  return done(null, false, { message: "Incorrect password" });
                }
                return done(null, user);
              } catch (err) {
                return done(err);
            }
        } 
    )  
)


router.post(
    "/login" ,
    async(req,res,next)=>{
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try{
                    // console.log("PASSPORT AUTHENTICATE user and error : ")
                    // console.log(err)
                    // console.log(user)
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }
            
                    req.login(
                        user,
                        { session: false }, //because we do not want to store users details in a session. Expecting user to send token on each req
                        async (error) => {
                        if (error) return next(error);
            
                        const body = { id: user.id, email: user.email };
                        const token = jwt.sign({ user: body }, process.env.SECRET_KEY);
            
                        return res.json({ token });
                        }
                    );
                }catch (error){
                    return next(error);
                }
            }
        ) (req, res, next) ;
    } 
)

router.all("*", passport.authenticate('jwt', { session: false })) 

router.get("/posts", protectedPostController.getAllPosts )

router.post("/posts", protectedPostController.addPost )

router.put("/posts/:postId", protectedPostController.updatePost)

router.delete("/posts/:postId" ,protectedPostController.deletePost )

router.delete("/posts/:postId/comments/:commentId" ,commentController.deleteCommentFromPost )

module.exports = router;