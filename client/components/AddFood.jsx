import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App.jsx';
import CurrentNutrition from './CurrentNutrition.jsx';
import GoalNutrition from './GoalNutrition.jsx';
import RemainingNutrition from './RemainingNutrition.jsx';
// require('dotenv').config();

//withRouter in react router was deprecated. recreate using hooks with withRouter function
//documentation: https://reactrouter.com/en/v6.3.0/faq
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
}
// Custom hook for handling input boxes
// saves us from creating onChange handlers for them individually
const useInput = (init) => {
  const [value, setValue] = useState(init);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  // return the value with the onChange function instead of setValue function
  return [value, onChange];
};

const AddFood = () => {
  const user = useContext(UserContext);
  const [foodQuery, foodQueryOnChange] = useInput('');
  const [servingSize, sizeOnChange] = useInput('');

  function searchFoodFromAPIAndAddToDb() {
    fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify({ item_name: foodQuery }),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        const {
          item_name,
          nf_calories,
          nf_total_fat,
          nf_total_carbohydrate,
          nf_protein,
          nf_serving_weight_grams,
        } = data;

        const body = {
          user: user.user,
          date: new Date(),
          item_name: item_name,
          nf_calories: Math.ceil(
            (servingSize / nf_serving_weight_grams) * nf_calories
          ),
          nf_total_fat: Math.ceil(
            (servingSize / nf_serving_weight_grams) * nf_total_fat
          ),
          nf_total_carbohydrate: Math.ceil(
            (servingSize / nf_serving_weight_grams) * nf_total_carbohydrate
          ),
          nf_protein: Math.ceil(
            (servingSize / nf_serving_weight_grams) * nf_protein
          ),

          nf_serving_weight_grams: servingSize,
        };

        let newCalories = Math.floor(user.calories + body.nf_calories);
        let newProtein = Math.floor(user.protein + body.nf_protein);
        let newFat = Math.floor(user.fat + body.nf_total_fat);
        let newCarbohydrate = Math.floor(
          user.carbohydrate + body.nf_total_carbohydrate
        );

        user.setCalories(newCalories);
        user.setProtein(newProtein);
        user.setFat(newFat);
        user.setCarbohydrate(newCarbohydrate);
        user.setServingSizeGram(servingSize);

        fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/JSON',
          },
          body: JSON.stringify(body),
        })
          .then((resp) => resp.json())

          .catch((err) => console.log('AddFood fetch: ERROR: ', err));
      })

      .catch((err) => console.log('SearchFood fetch: ERROR: ', err));
  }

  const searchFood = async () => {
    const req = await fetch(`/api/search?foodQuery=${foodQuery}`);
    const res = await req.json();
    console.log({ res });
  };

  const saveToDatabase = () => {};

  return (
    <div className='editFoodPages'>
      <div className='fixed-container'>
        <GoalNutrition />
        <CurrentNutrition />
        <RemainingNutrition />
      </div>
      <div className='editFoodContainer'>
        <article className='cardEditFood'>
          <h3>What did you eat?</h3>
          <div className='editFoodFields'>
            <label htmlFor='name'>Food Item: </label>
            <input
              className='input'
              name='Food'
              placeholder='Enter food'
              value={foodQuery}
              onChange={foodQueryOnChange}
            />
          </div>
          <div className='editFoodFields'>
            <label htmlFor='name'>How many grams? </label>
            <input
              className='input'
              name='Food'
              placeholder='Enter grams'
              value={servingSize}
              onChange={sizeOnChange}
            />
          </div>
          <div className='createCharButtonContainer'>
            <Link to='/home' className='backLink'>
              <button type='button' className='btnSecondary'>
                Go Back
              </button>
            </Link>
            <button type='button' className='btnMainAdd' onClick={searchFood}>
              Save
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default withRouter(AddFood);
