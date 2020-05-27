import express from "express";
import routes from "../routes";
import {onlyPrivate} from "../middlewares";
import {users,userDetail,editProfile,changePassword} 
    from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, editProfile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), onlyPrivate, userDetail);




export default userRouter;

