import React, { useState } from 'react';

const NewFurniture = (props) => {
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [edition, setEdition] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();

    if (!image || !description || !edition || !size || !price) {
      alert('Please fill up the form');
      return;
    }

    props.AddFurniture(image, description, edition, size, price);

    setImage('');
    setDescription('');
    setEdition('');
    setSize('');
    setPrice('');
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-row">
        <input
          type="text"
          className="form-control"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image"
        />
        <input
          type="text"
          className="form-control mt-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="text"
          className="form-control mt-2"
          value={edition}
          onChange={(e) => setEdition(e.target.value)}
          placeholder="Edition"
        />
         <input
          type="text"
          className="form-control mt-2"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="Size"
        />
        <input
          type="text"
          className="form-control mt-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
        <button type="submit" className="btn btn-outline-dark mt-2">
          Add Furniture
        </button>
      </div>
    </form>
  );
};

export default NewFurniture;
