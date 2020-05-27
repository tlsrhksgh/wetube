import routes from "../routes";
import User from "../models/User";
import passport from "passport";

export const getJoin = (req, res) => {
    res.render("Join", {pageTitle:"Join"});
};

export const postJoin = async(req, res, next) => {
    const {
        body: {name, email, password, password2}
    } = req;
    if(password !== password2){
        res.status(400);
        res.render("Join", {pageTitle:"Join"});
    }else{
        try{
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            next();
        } catch(error){
            console.log(error);
            res.redirect(routes.home);
        }     
        
    }
    
};

export const getLogin = (req, res) => res.render("Login", {pageTitle:"Login"});

export const postLogin = passport.authenticate("local", { // authenticate는 username(email),password를 찾아보도록 설정되어 있음.
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
    const { _json: {id, avatar_url, name, email, } } = profile;
    try{
        const user = await User.findOne({email})
        if(user) {
            user.githubId = id;
            user.save();
            return cb(null, user);
        } 
            const newUser = await User.create({
                email,
                name,
                githubId: id,
                avatar_url: avatar_url
            });
            return cb(null, newUser);
    }catch(error){
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home)
};

export const logout = (req, res) => {
    req.logout(); // passport로 인하여 req.logout()만 쓰면 쿠키 등등을 일괄 처리해줌.
    res.redirect(routes.home);
}
export const users = (req, res) => res.render("users", {pageTitle:"Users"});
export const changePassword = (req, res) => res.render("ChangePassword", {pageTitle:"Change Password"});
export const editProfile = (req, res) => res.render("EditProfile", {pageTitle:"Edit Profile"});
export const userDetail = (req, res) => res.render("UserDetail", {pageTitle:"User Detail"});