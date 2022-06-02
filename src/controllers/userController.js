import express from "express";
import User from "../models/User";
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
    return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => {
    console.log(req.params);
    return res.send("See User");
}