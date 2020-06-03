import "core-js";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session, { Store } from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleWare } from "./middleWares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";   

import "./passport"

const app = express();

const CookieStore = MongoStore(session);


app.use(helmet());
app.set("view engine", "pug");
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads")); /*directory에서 file을 보내주는 Middleware, 하지만 이렇게 하는 방법은 server에 파일이 저장되므로 좋지 않은 방법이다.
 이런식으로 사용하게 되면 한 user가 무거운 파일을 올릴 경우 다른 user오는 것이 막힐 수 있다. 이 방법은 연습.*/
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize()); 
app.use(passport.session());

app.use(localsMiddleWare);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;