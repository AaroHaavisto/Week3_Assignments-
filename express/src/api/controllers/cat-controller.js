import {
  addCat,
  deleteCat,
  getAllCats,
  getCatById,
  getCatsByUserId,
  updateCat,
} from '../models/cat-model.js';

const catListGet = async (req, res, next) => {
  try {
    const cats = await getAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catGet = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cat = await getCatById(id);

    if (!cat) {
      return res.status(404).json({message: 'Cat not found.'});
    }

    return res.json(cat);
  } catch (error) {
    next(error);
  }
};

const catsByUserGet = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const cats = await getCatsByUserId(userId);
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catPost = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.cat_name ?? req.body.name,
      birthdate: req.body.birthdate,
      weight: req.body.weight,
      owner: Number(req.body.owner ?? req.body.owner_id ?? req.body.user_id),
      filename: req.file?.filename ?? null,
    };

    const newCat = await addCat(payload);
    res.status(201).json(newCat);
  } catch (error) {
    next(error);
  }
};

const catPut = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payload = {
      name: req.body.cat_name ?? req.body.name,
      birthdate: req.body.birthdate,
      weight: req.body.weight,
      owner: Number(req.body.owner ?? req.body.owner_id ?? req.body.user_id),
    };

    const updatedCat = await updateCat(id, payload, res.locals.user);
    if (!updatedCat) {
      return res.status(403).json({message: 'Not allowed or cat not found.'});
    }

    return res.json(updatedCat);
  } catch (error) {
    next(error);
  }
};

const catDelete = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deletedRows = await deleteCat(id, res.locals.user);
    if (deletedRows === 0) {
      return res.status(403).json({message: 'Not allowed or cat not found.'});
    }

    return res.json({message: 'Cat deleted.'});
  } catch (error) {
    next(error);
  }
};

export {catListGet, catGet, catsByUserGet, catPost, catPut, catDelete};
