import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

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

const AddFood = (props) => {
  const [item_name, nameOnChange] = useInput('');

  const saveFood = () => {
    const body = {
      item_name,
    };
    fetch(
      'https://api.nutritionix.com/v1_1/search/bacon?results=0:5&nf_protein==1&fields=item_name,nf_calories,nf_protein,nf_total_carbohydrate,nf_total_fat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify(body),
      }
    )
      .then((resp) => {
        console.log(resp);
        resp.json();
      })
      .then((data) => {
        // console.log(data);
      })
      //   .then(() => {
      //     props.history.push('/');
      //   })
      .catch((err) => console.log('AddFood fetch: ERROR: ', err));
  };

  return (
    <section className='mainSection createFoodContainer'>
      <header className='pageHeader'>
        <h2>Add Food</h2>
      </header>

      <article className='card createFood'>
        <h3>What did you eat?</h3>
        <div className='createFoodFields'>
          <label htmlFor='name'>Food Item: </label>
          <input
            name='Food'
            placeholder='Enter food'
            value={item_name}
            onChange={nameOnChange}
          />
        </div>
        <div className='createCharButtonContainer'>
          <Link to='/' className='backLink'>
            <button type='button' className='btnSecondary'>
              Cancel
            </button>
          </Link>
          <button type='button' className='btnMain' onClick={saveFood}>
            Save
          </button>
        </div>
      </article>
    </section>
  );
};

export default withRouter(AddFood);
