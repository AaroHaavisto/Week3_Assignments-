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
  console.log('catPost req.body:', req.body);
  console.log('catPost req.file:', req.file);

  const payload = {
    name: req.body.cat_name ?? req.body.name,
    birthdate: req.body.birthdate,
    weight: req.body.weight,
    owner: req.body.owner,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
    filename: req.file?.filename,
  };

  const newCat = addCat(payload);
  res.status(201).json(newCat);
};

const catPut = (req, res) => {
  res.json({message: 'Cat item updated.'});
};

const catDelete = (req, res) => {
  res.json({message: 'Cat item deleted.'});
};

export {catListGet, catGet, catPost, catPut, catDelete};
