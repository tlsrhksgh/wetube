import routes from "../routes"
import Video from "../models/Video"
import uploadVideo from "../middlewares";

export const home = async(req, res) => {
    try{
        const videos = await Video.find({});
        res.render("home", {pageTitle: "Home", videos});
    }catch(error){
        console.log(error);
        res.render("home", {pageTitle: "Home", videos: []});
    }
      
    
};

export const search = (req, res) => {
    const {
        query: {term: searchingBy}
    } = req;
    res.render("search", {pageTitle: "Search", searchingBy, videos});
};

export const getUpload = (req, res) => 
res.render("upload", {pageTitle: "Upload"});

export const postUpload = async(req, res) => {
    const {
         body: { title, description},
         file: { path }
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description
    });
    console.log(newVideo);
    res.redirect(routes.videoDetail(newVideo.id));
};


export const videoDetail = async(req, res) => {
    const {
        params: {id}
    } = req;
    try{
        const video = await Video.findById(id);
        res.render("videoDetail", {pageTitle: "videoDetail", video});
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    }
   
}

export const getEditVideo = async(req, res)  => { // get은 무언가 채워놓는 작업
    const {
        params: {id}
    } = req;
    try{
        const video = await video.findById(id);
        res.render("editVideo", {pageTitle: `Edit ${video.title}`, video});
    }catch(error){
        res.redirect(routes.home);
    }
};


export const postEditVideo = (req, res) => { //post는 업데이트 및 redirect를 해주는 작업
    const {
        params: {id}
    } = req;
};



export const deleteVideo = (req, res) => res.render("DeleteVideo", {pageTitle: "deleteVideo"});
