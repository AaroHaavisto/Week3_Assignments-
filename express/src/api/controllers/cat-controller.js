import {
  addCat,
  deleteCat,
  getAllCats,
  getCatById,
  getCatsByUserId,
  updateCat,
} from '../models/cat-model.js';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

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
    if (Number.isNaN(id)) {
      return next(createError('Invalid cat id.', 400));
    }
    const cat = await getCatById(id);

    if (!cat) {
      return next(createError('Cat not found.', 404));
    }

    return res.json(cat);
  } catch (error) {
    next(error);
  }
};

const catsByUserGet = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return next(createError('Invalid user id.', 400));
    }
    const cats = await getCatsByUserId(userId);
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catPost = async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const owner = Number(body.owner ?? body.owner_id ?? body.user_id);
    const payload = {
      name: body.cat_name ?? body.name,
      birthdate: body.birthdate,
      weight: body.weight,
      owner,
      filename: req.file?.filename ?? null,
    };

    if (!payload.name || !payload.birthdate || !payload.weight || Number.isNaN(owner)) {
      return next(createError('Missing required cat fields.', 400));
    }

    const newCat = await addCat(payload);
    res.status(201).json(newCat);
  } catch (error) {
    next(error);
  }
};

const catPut = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next(createError('Invalid cat id.', 400));
    }
    const body = req.body ?? {};
    const owner = Number(body.owner ?? body.owner_id ?? body.user_id);
    const payload = {
      name: body.cat_name ?? body.name,
      birthdate: body.birthdate,
      weight: body.weight,
      owner,
    };

    if (!payload.name || !payload.birthdate || !payload.weight || Number.isNaN(owner)) {
      return next(createError('Missing required cat fields.', 400));
    }

    const updatedCat = await updateCat(id, payload, res.locals.user);
    if (!updatedCat) {
      return next(createError('Not allowed or cat not found.', 403));
    }

    return res.json(updatedCat);
  } catch (error) {
    next(error);
  }
};

const catDelete = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next(createError('Invalid cat id.', 400));
    }
    const deletedRows = await deleteCat(id, res.locals.user);
    if (deletedRows === 0) {
      return next(createError('Not allowed or cat not found.', 403));
    }

    return res.json({message: 'Cat deleted.'});
  } catch (error) {
    next(error);
  }
};

export {catListGet, catGet, catsByUserGet, catPost, catPut, catDelete};
