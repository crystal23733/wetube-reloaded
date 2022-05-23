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
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if(!video){
    return res.render("404", {pageTitle:"Video not found."});
  };
  return res.render("watch", {pageTitle : video.title, video})
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if(!video){
    return res.render("404", {pageTitle:"Video not found."});
  }
  res.render("edit", {pageTitle : `Editing :${video.title}`, video})
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({_id : id});
  if(!video){
    return res.render("404", {pageTitle:"Video not found."});
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`)),
  });
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
      hashtags: hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`)),
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