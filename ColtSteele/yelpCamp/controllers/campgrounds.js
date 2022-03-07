const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const campground = require("../models/campground");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.showMyCamp = async (req, res, next) => {
  const id = req.user._id;
  const campgrounds = await Campground.find({
    author: id,
  });

  let currentPage = Number(req.query.page);
  if (!currentPage || currentPage < 1) {
    // if client req /index w/o ?page
    currentPage = 1;
    // get campgrounds from the database

    // Initialize Pagination
    let len = campgrounds.length;
    req.session.pagination = {
      totalItems: len, // total # of campgrounds
      itemsPerPage: 20,
      totalPages: Math.ceil(len / 20), // total # of pages
    };
  }

  if (!req.session.pagination || !campgrounds) {
    res.redirect("/campgrounds/mycampgrounds");
  }
  const { itemsPerPage, totalItems, totalPages } = req.session.pagination;

  let start = (currentPage - 1) * itemsPerPage;
  let end = currentPage * itemsPerPage;
  if (end > totalItems) end = totalItems;

  res.render("campgrounds/myCamp", {
    campgrounds,
    totalPages,
    currentPage,
    start,
    end,
  });
};

module.exports.index = async (req, res, next) => {
  let currentPage = Number(req.query.page);
  const campgrounds = await Campground.find({});

  if (!currentPage || currentPage < 1) {
    // if client req /index w/o ?page
    currentPage = 1;

    // Initialize Pagination
    let len = campgrounds.length;
    req.session.pagination = {
      totalItems: len, // total # of campgrounds
      itemsPerPage: 20,
      totalPages: Math.ceil(len / 20), // total # of pages
    };
  }

  if (!req.session.pagination || !campgrounds) res.redirect("campgrounds/");

  const { itemsPerPage, totalItems, totalPages } = req.session.pagination;

  let start = (currentPage - 1) * itemsPerPage;
  let end = currentPage * itemsPerPage;
  if (end > totalItems) end = totalItems;

  res.render("campgrounds/", {
    campgrounds,
    totalPages,
    currentPage,
    start,
    end,
  });
};

module.exports.search = async (req, res) => {
  const searchTerm = req.query.q;

  const campgrounds = await Campground.aggregate([
    {
      $search: {
        index: "campgroundIndex",
        text: {
          query: searchTerm,
          path: {
            wildcard: "*",
          },
        },
      },
    },
    {
      $limit: 10,
    },
  ]);
  console.log(campgrounds);

  res.render("campgrounds/search", {
    searchTerm,
    campgrounds,
  });
};

module.exports.renderNewForm = async (req, res, next) => {
  res.render("campgrounds/new", {});
};

module.exports.createCampground = async (req, res, next) => {
  await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send()
    .then((response) => {
      if (
        !response ||
        !response.body ||
        !response.body.features ||
        !response.body.features.length
      ) {
        req.flash("error", `Invalid response: ${response}`);

        return res.redirect("/campgrounds/new");
      } else {
        req.body.campground.geometry = response.body.features[0].geometry;
      }
    });

  req.body.campground.author = req.user._id;

  req.body.campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  req.body.campground.lastUpdated = Date.now();

  const campground = new Campground(req.body.campground);

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
    .populate({
      path: "author",
    });

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
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
