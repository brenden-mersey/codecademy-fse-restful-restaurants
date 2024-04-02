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

const joinRestaurantData = () => {
  return STARRED_RESTAURANTS.map((starredRestaurant) => {
    const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === starredRestaurant.restaurantId);
    return {
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
  const joinedStarredRestaurants = joinRestaurantData();

  res.json(joinedStarredRestaurants);

});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {

  // Requested restaurant by ID
  const { id } = req.params;

  // Find the restaurant with the matching id.
  const joinedStarredRestaurants = joinRestaurantData();
  const foundStarredRestaurant = joinedStarredRestaurants.find((restaurant) => restaurant.id === id );

  if (!foundStarredRestaurant) {
    res.sendStatus(404);
    return;
  }

  res.json(foundStarredRestaurant);

});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {

  const { body } = req;
  const { comment, restaurantId } = body;

  const newId = uuidv4();
  const newStarredRestaurant = {
    id: newId,
    comment,
    restaurantId
  };

  STARRED_RESTAURANTS.push(newStarredRestaurant);

  res.status(200).json(newStarredRestaurant);

});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */


/**
 * Feature 10: Updating your comment of a starred restaurant.
 */

module.exports = router;
