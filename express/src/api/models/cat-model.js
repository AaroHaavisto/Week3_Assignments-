const catItems = [
  {
    cat_id: 1,
    name: 'Whiskers',
    birthdate: '2020-05-15',
    weight: 4.5,
    owner: 'John Doe',
    image: 'https://loremflickr.com/320/240/cat',
  },
  {
    cat_id: 2,
    name: 'Mittens',
    birthdate: '2021-08-21',
    weight: 3.8,
    owner: 'Jane Smith',
    image: 'https://loremflickr.com/320/240/kitten',
  },
];

const getAllCats = () => catItems;

const getCatById = id => catItems.find(cat => cat.cat_id === id);

const addCat = cat => {
  const newCat = {
    cat_id: catItems.length
      ? Math.max(...catItems.map(item => item.cat_id)) + 1
      : 1,
    ...cat,
  };
  catItems.push(newCat);
  return newCat;
};

export {getAllCats, getCatById, addCat};
