import React from 'react';

const Furnitures = (props) => {
  return (
    <div className='container'> 
      <div className='row'>
        {props.furnitures.map((furn) => (
          <div className='col-3' key={furn.index}>
            <div className='card'>

              <div className='card-img'>
                <img className='img-fluid' src={furn.image} alt='furniture cover'/>
              </div>

              <div className='card-section'>
                Furniture description: {furn.description}
              </div>

              <div className='card-section'>
                <h3>Furniture Edition: {furn.edition}</h3>
              </div>

              <div className='card-section'>
                <h3>Furniture Size {furn.size}</h3>
              </div>


              <div className='card-bottom'>
                <h3>Price: {furn.price / 1000000000000000000} cUSD</h3>
              </div>

              <div>
                {props.owner !== furn.owner && (
                  <button type='button' className='btn btn-outline-dark' onClick={() => props.purchaseFurniture(furn.index)}>Purchase Item</button>
                )}

                
                  <button type='button' className='btn btn-outline-dark' onClick={() => props.removeItem(furn.index)}>Remove Item</button>
                
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Furnitures;