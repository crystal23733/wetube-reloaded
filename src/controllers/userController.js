import express from "express";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", {pagetitle:"join"});
};
export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const { email, username, password, password2, name, location } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if(password !== password2){
        return res.render("join", {
            pageTitle,
            errorMessage : "비밀번호가 일치하지 않습니다.",
        });
    };
    if(exists){
        return res.render("join", {
            pageTitle,
            errorMessage : "닉네임 또는 이메일이 사용중입니다.",
        });
    };
    await User.create({
        email,
        username,
        password,
        name,
        location,
      });
    return res.redirect("/login");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => {
    console.log(req.params);
    return res.send("See User");
}