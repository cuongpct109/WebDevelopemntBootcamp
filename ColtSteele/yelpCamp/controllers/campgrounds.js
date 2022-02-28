const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {
    campgrounds,
  });
};

module.exports.renderNewForm = async (req, res, next) => {
  res.render("campgrounds/new", {});
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  const error = campground.validateSync();
  if (error) {
    req.flash("error", `${error.message}`);
    return res.redirect("/campgrounds/new");
  }
  await campground.save();
  if (req) req.flash("success", "Successfully made a campground!!!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/show", {
    campground,
  });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;

  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const oldImageAmount = campground.images.length;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  const imageError = campground.validateSync();

  if (imageError) {
    req.flash(
      "error",
      `${imageError.errors["images"].message}. We already had ${oldImageAmount} images.`
    );
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  await campground.save();
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
