import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";


export const getJoin = (req, res) => {
    res.render("join", {pagetitle:"join"});
};
export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const { email, username, password, password2, name, location } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if(password !== password2){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage : "비밀번호가 일치하지 않습니다.",
        });
    };
    try{
        await User.create({
            email,
            username,
            password,
            name,
            location,
          });
        return res.redirect("/login");
    } catch(error){
        if(exists){
            return res.status(400).render("join", {
                pageTitle,
                errorMessage : "닉네임 또는 이메일이 사용중입니다.",
            });
        };
    }
};
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle:"Login"});
};
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username });
    if(!user){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage:"계정이 존재하지 않습니다.",
        });
    };
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage:"비밀번호가 틀립니다.",
        });
    };
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id:process.env.GH_CLIENT,
        allow_signup:false,
        scope: "read:user user:email",
    }; 
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        const userRequest = await (
            await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        console.log(userRequest);
    } else {
        return res.redirect("login");
    }
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => {
    console.log(req.params);
    return res.send("See User");
}