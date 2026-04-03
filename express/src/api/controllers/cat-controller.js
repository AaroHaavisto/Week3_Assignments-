import {addCat, getAllCats, getCatById} from '../models/cat-model.js';

const catListGet = (req, res) => {
  res.json(getAllCats());
};

const catGet = (req, res) => {
  const id = Number(req.params.id);
  const cat = getCatById(id);

  if (!cat) {
    return res.status(404).json({message: 'Cat not found.'});
  }

  return res.json(cat);
};

const catPost = (req, res) => {
  const newCat = addCat(req.body);
  res.status(201).json(newCat);
};

const catPut = (req, res) => {
  res.json({message: 'Cat item updated.'});
};

const catDelete = (req, res) => {
  res.json({message: 'Cat item deleted.'});
};

export {catListGet, catGet, catPost, catPut, catDelete};
