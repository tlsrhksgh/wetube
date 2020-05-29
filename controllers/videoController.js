import routes from "../routes"
import Video from "../models/Video"
import uploadVideo from "../middlewares";

export const home = async(req, res) => {
    try{
        const videos = await Video.find({}).sort({_id: -1}); // 모든 video id를 찾은 후 sort로 비디오 정렬. -1값은 위 아래 순서를 바꾸겠다는 약속. 최근 업로드 된 id를 찾은 후 위에서 아래로
        res.render("home", {pageTitle: "Home", videos});
    }catch(error){
        console.log(error);
        res.render("home", {pageTitle: "Home", videos: []});
    }
      
    
};

export const search = async(req, res) => {
    const {
        query: {term: searchingBy}
    } = req;
    let videos =[];
    try{
        videos = await Video.find({
            title: { $regex : searchingBy, $options: "i"} // regex 정규표현식으로 검색에 해당하는 단어가 포함되어 있으면 해당 단어가 포함된 결과가 출력 됨.
    });
    }catch(error){
        console.log(error);
    }
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
        description,
        creator: req.user.id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};


export const videoDetail = async(req, res) => {
    const {
        params: {id}
    } = req;
    try{
        const video = await Video.findById(id).populate("creator"); //.populate 객체를 데려오는 함수
        res.render("videoDetail", {pageTitle: video.title, video});
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    }
   
}

export const getEditVideo = async(req, res)  => { // get은 무언가 채워놓는 작업. 즉, 템플릿을 렌더링 해주는 기능
    const {
        params: {id}
    } = req;
    try{
        const video = await Video.findById(id); 
        if(video.creator !== req.user.id){
            throw error();
        } else {
        res.render("editVideo", {pageTitle: `Edit ${video.title}`, video}); // 템플릿으로 Data를 내보내는 작업
        }
    }catch(error){
        res.redirect(routes.home);
    }
};


export const postEditVideo = async(req, res) => { //post는 업데이트 및 redirect를 해주는 작업
    const {
        params: {id},
        body: {title, description}
    } = req;
    try{
        await Video.findOneAndUpdate({_id: id}, {title, description}); // 동영상 제목 및 설명 update 
        res.redirect(routes.videoDetail(id));
    } catch (error){
        res.redirect(routes.home);
    }
};



export const deleteVideo = async(req, res) => {
    const {
        params: {id}
    } = req;
    try{
        const video = await Video.findById(id); 
        if(video.creator !== req.user.id){
            throw error();
        } else {
            await Video.findOneAndDelete({_id: id});
        //res.render("editVideo", {pageTitle: `Edit ${video.title}`, video}); 템플릿으로 Data를 내보내는 작업
        }
    }catch(error){
        console.log(error);
    }
    res.redirect(routes.home); // try부분과 redirect 경로가 겹쳐지므로 밖으로 빼놓음. 이렇게 되면 삭제가 성공하던 실패하던 home으로 이동.  
};
