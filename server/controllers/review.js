const Review = require("../models/review");
const Home = require("../models/home");
const User = require("../models/user");
const { arrayToObject, formatDate } = require("../utils");

// get user id from session
const user_id = req => req.session.passport.user;

const allReviews = async (req, res) => {
  const reviews = await Review.find({}).then(review => {
    const res = arrayToObject(review, "_id");
    return res;
  });
  res.json(reviews);
};

const reviewById = async (req, res) => {
  const review = await Review.findById({ _id: req.params.id }).then(
    review => review
  );
  res.json(review);
};

const newReview = async (req, res) => {
  const review = new Review(req.body);
  review.reviewerId = user_id(req);
  review.reviewdate = formatDate(new Date());
  const newReview = await review.save();
  // host of home recieves a review
  const reviewee = await User.findById(review.hostId).then(user => {
    // add new review to end of array
    user.reviews = [...user.reviews, newReview];
    return user.save();
  });
  // home receives review
  const home = await Home.findById(newReview.houseId).then(home => {
    home.reviews = [...home.reviews, newReview];
    return home.save();
  });
  res.json(newReview);
};

const editReview = async (req, res) => {
  const review = await Review.findById(req.params.id).then(review => {
    review.set(req.body);
    return review.save();
  });
  res.json(review);
};

module.exports = {
  allReviews,
  reviewById,
  newReview,
  editReview
};
