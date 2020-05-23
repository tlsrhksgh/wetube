import express from "express";
import routes from "../routes";
import {getUpload, postUpload, videoDetail, deleteVideo, getEditVideo, postEditVideo}
 from "../controllers/videoController";
import { uploadVideo } from "../middlewares";

const videoRouter = express.Router();

//Upload 
videoRouter.post(routes.upload, uploadVideo, postUpload);
videoRouter.get(routes.upload, getUpload);

//Video Detail
videoRouter.get(routes.videoDetail(), videoDetail);

//Edit Video
videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.post(routes.editVideo(), postEditVideo);

//Delete Video
videoRouter.get(routes.deleteVideo, deleteVideo);

export default videoRouter;

