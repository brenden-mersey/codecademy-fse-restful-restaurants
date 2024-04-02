const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Utility to join data together
 */
const joinedRestaurantData = () => {
  return STARRED_RESTAURANTS.map((starredRestaurant) => {
    const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === starredRestaurant.restaurantId);
    return {
      restaurantID: restaurant.id,
      id: starredRestaurant.id,
      comment: starredRestaurant.comment,
      name: restaurant.name,
    };
  });
}

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {

  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  res.json(joinedRestaurantData());

});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {

  // Extract restaurant ID
  const { id } = req.params;

  // Get joined restaurant data
  const restaurants = joinedRestaurantData();

  // Find restaurant by ID
  const foundRestaurant = restaurants.find((restaurant) => restaurant.id === id );

  // If not found
  if ( !foundRestaurant ) {
    res.sendStatus(404);
    return;
  }

  // JSON response
  res.json({
    id: foundRestaurant.restaurantID,
    comment: foundRestaurant.comment,
    name: foundRestaurant.name
  });

});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {

  const { id } = req.body;

  const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);
  const starredRestaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.restaurantId === id);

  if ( !restaurant || starredRestaurant ) {
    res.sendStatus(404);
    return;
  }

  // Create a record for the new starred restaurant
  const newStarredRestaurant = {
    id: uuidv4(),
    restaurantId: restaurant.id,
    comment: null
  };

  // Push the new record into STARRED_RESTAURANTS
  STARRED_RESTAURANTS.push(newStarredRestaurant);

  res.status(200).send({
	  id: newStarredRestaurant.id,
	  comment: newStarredRestaurant.comment,
	  name: restaurant.name
  });

});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {

  // Extract restaurant ID
  const { id: starredID } = req.params;

  // Remove starred restaurant from array by starred restaurant id
  const FILTERED_STARRED_RESTAURANTS = STARRED_RESTAURANTS.filter((restaurant) => restaurant.id !== starredID);

  // If arrays are the same size, nothing was removed
  if ( FILTERED_STARRED_RESTAURANTS.length === STARRED_RESTAURANTS.length ) {
    res.sendStatus(404);
    return;
  }

  // Update array
  STARRED_RESTAURANTS = FILTERED_STARRED_RESTAURANTS;


  res.sendStatus(200);

});


/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (req, res) => {

  const { id } = req.params;
  const { newComment } = req.body;

  const starredRestaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);

  if ( !starredRestaurant ) {
    res.sendStatus(404);
    return;
  }

  starredRestaurant.comment = newComment;

  res.sendStatus(200);

});

module.exports = router;
