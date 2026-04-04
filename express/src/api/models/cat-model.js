import promisePool from '../utils/database.js';

const baseCatSelect = `
  SELECT
    c.cat_id,
    c.cat_name AS name,
    c.birthdate,
    c.weight,
    c.owner AS owner_id,
    u.name AS owner,
    c.filename,
    CASE
      WHEN c.filename IS NULL OR c.filename = '' THEN NULL
      ELSE CONCAT('/uploads/', c.filename)
    END AS image
  FROM cat c
  LEFT JOIN \`user\` u ON c.owner = u.user_id
`;

const getAllCats = async () => {
  const [rows] = await promisePool.query(`${baseCatSelect} ORDER BY c.cat_id`);
  return rows;
};

const getCatById = async id => {
  const [rows] = await promisePool.query(`${baseCatSelect} WHERE c.cat_id = ?`, [id]);
  return rows[0] || null;
};

const getCatsByUserId = async userId => {
  const [rows] = await promisePool.query(
    `${baseCatSelect} WHERE c.owner = ? ORDER BY c.cat_id`,
    [userId]
  );
  return rows;
};

const addCat = async cat => {
  const [result] = await promisePool.query(
    `INSERT INTO cat (cat_name, birthdate, weight, owner, filename)
     VALUES (?, ?, ?, ?, ?)`,
    [cat.name, cat.birthdate, cat.weight, cat.owner, cat.filename ?? null]
  );

  return getCatById(result.insertId);
};

const updateCat = async (id, cat, user) => {
  const values = [cat.name, cat.birthdate, cat.weight, cat.owner, id];
  let sql = `
    UPDATE cat
    SET cat_name = ?, birthdate = ?, weight = ?, owner = ?
    WHERE cat_id = ?
  `;

  if (user.role !== 'admin') {
    sql += ' AND owner = ?';
    values.push(user.user_id);
  }

  const [result] = await promisePool.query(sql, values);
  if (result.affectedRows === 0) {
    return null;
  }

  return getCatById(id);
};

const deleteCat = async (id, user) => {
  let sql = 'DELETE FROM cat WHERE cat_id = ?';
  const values = [id];

  if (user.role !== 'admin') {
    sql += ' AND owner = ?';
    values.push(user.user_id);
  }

  const [result] = await promisePool.query(sql, values);
  return result.affectedRows;
};

export {getAllCats, getCatById, getCatsByUserId, addCat, updateCat, deleteCat};
