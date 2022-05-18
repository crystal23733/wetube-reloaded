import Video from "../models/Video";

// console.log("start");
// Video.find({}, (error, videos) => {
//   console.log("Finished");
//   return res.render("home", {pageTitle : "Home", videos : []});
// });
// console.log("I finish first");
export const home = async(req, res) => {
  const videos = await Video.find({});
  return res.render("home", {pageTitle : "Home", videos});
}
export const watch = (req, res) => {
  const { id } = req.params;
  res.render("watch", {pageTitle : `Watching : `})
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  res.render("edit", {pageTitle : `Editing : `})
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/video/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle : "Upload video"});
}
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try{
    await Video.create({
      title: title,
      description: description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  }
  catch(error){
    return res.render("upload", {pageTitle : "Upload video", errorMessage: error._message,});
  }
};
export const search = (req, res) => res.send("Search");
export const deleteVideo = (req, res) => {
    console.log(req.params);
    return res.send("Delete Video");
}