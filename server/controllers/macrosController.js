const models = require('../models/macrosModels');
const axios = require('axios');
require('dotenv').config();

const macrosController = {};

macrosController.getFood = (req, res, next) => {
  models.Post.find({ user: req.body.user })
    .then((data) => {
      res.locals.food = data;
      next();
    })
    .catch((err) => {
      console.log('macros controller error: ', err);
    });
};

macrosController.deleteFood = (req, res, next) => {
  if (!req.body.item_name) {
    models.Post.deleteMany()
      .then((data) => {
        res.locals.food = data;
        next();
      })
      .catch((err) => {
        console.log('macros controller error: ', err);
      });
  } else {
    models.Post.findOneAndDelete({ item_name: req.body.item_name })
      .then((data) => {
        res.locals.food = data;
        next();
      })
      .catch((err) => {
        console.log('macros controller error: ', err);
      });
  }
};

macrosController.addFood = (req, res, next) => {
  const {
    user,
    date,
    item_name,
    nf_calories,
    nf_total_fat,
    nf_total_carbohydrate,
    nf_protein,
    nf_serving_weight_grams,
  } = req.body;

  models.Post.create({
    user: user,
    date: date,
    item_name: item_name,
    nf_calories: nf_calories,
    nf_total_fat: nf_total_fat,
    nf_total_carbohydrate: nf_total_carbohydrate,
    nf_protein: nf_protein,
    nf_serving_weight_grams: nf_serving_weight_grams,
  })
    .then((foodDoc) => {
      res.locals.food = foodDoc;
      next();
    })
    .catch((err) => {
      next({
        log: `macrosController.addFood: Error: ${err}`,
        message: {
          err: 'Error occurred in macrosController.addFood. Check server log for more details',
        },
      });
    });
};

macrosController.searchFood = (req, res, next) => {
  const options = {
    method: 'GET',
    url: 'https://edamam-food-and-grocery-database.p.rapidapi.com/api/food-database/v2/parser',
    headers: {
      'X-RapidAPI-Key': process.env.EDAMAM_API_KEY,
      'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com',
    },
    params: {
      ingr: req.query.foodQuery
    }
  };

  axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .then((data) => {
      res.locals.queryResult = data;
      next();
    })
    .catch((err) => {
      next({
        log: `macrosController.searchFood: Error: ${err}`,
        message: {
          err: 'Error occurred in macrosController.searchFood. Check server log for more details',
        },
      });
    });
};

module.exports = macrosController;
