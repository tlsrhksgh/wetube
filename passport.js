import passport from "passport";
import GitHubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import { githubLoginCallback,facebookLoginCallback } from "./controllers/userController";
import routes from "./routes";

// passport.js문법이 아닌 passport-local-mongoose로 진행. 왜냐하면 passport.js코드보다 간략하게 작성 가능.
passport.use(User.createStrategy()); 

passport.use(new GitHubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: `http://localhost:4000${routes.githubCallback}`}, 
    githubLoginCallback)    
);

passport.use(
    new FacebookStrategy(
    {
        clientID: process.env.FB_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL: `https://2b1b1366e0fb.ngrok.io${
            routes.facebookCallback
        }`,
            profileFields: ["id", "displayName", "photos", "email"],
            scope: ["public_profile", "email"]
        },
        facebookLoginCallback
    )
);

passport.serializeUser(User.serializeUser()); // 어떤 field가 쿠키에 포함될 것인지 알려주는 역할.
// ↑ 쿠키에는 오직 user.id만 담아서 보내도록 함. 쿠키 정보는 민감함으로 간략한 정보를 담는게 중요. 

passport.deserializeUser(User.deserializeUser()); // 받은 쿠키 정보를 어떻게 사용자로 전환하는가를 의미