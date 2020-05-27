import routes from "./routes";
import multer from "multer";

const multerVideo = multer({dest:"uploads/videos/"});

export const localsMiddleWare = (req, res, next) => {
    res.locals.siteName = "WeTube";
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null ;//passport가 user가 담긴 object를 request에도 담아서 준다.
    next();
}

export const onlyPublic = (req, res, next) => {
    if(req.user){
        res.redirect(routes.home)
  } else {
      next();
  }
};

export const onlyPrivate = (req, res, next) => {
    if(req.user){
        next();
    }else {
        res.redirect(routes.login);
    }
};

export const uploadVideo = multerVideo.single("videoFile");