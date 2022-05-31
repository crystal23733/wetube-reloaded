import express from "express";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", {pagetitle:"join"});
};
export const postJoin = async (req, res) => {
    const { email, username, password, name, location } = req.body;
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