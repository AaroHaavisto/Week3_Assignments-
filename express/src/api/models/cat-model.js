import promisePool from '../utils/database.js';

let usersTableCache = null;
let catsTableCache = null;

const resolveExistingTable = async candidates => {
  const placeholders = candidates.map(() => '?').join(', ');
  const [rows] = await promisePool.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = DATABASE()
       AND table_name IN (${placeholders})`,
    candidates
  );

  if (!rows.length) {
    throw new Error(`No matching table found from candidates: ${candidates.join(', ')}`);
  }

  const found = rows.map(row => row.table_name);
  return candidates.find(name => found.includes(name));
};

const getUsersTable = async () => {
  if (!usersTableCache) {
    usersTableCache = await resolveExistingTable(['user', 'wsk_users']);
  }
  return usersTableCache;
};

const getCatsTable = async () => {
  if (!catsTableCache) {
    catsTableCache = await resolveExistingTable(['cat', 'wsk_cats']);
  }
  return catsTableCache;
};

const buildBaseCatSelect = async () => {
  const catsTable = await getCatsTable();
  const usersTable = await getUsersTable();

  return `
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
    FROM \`${catsTable}\` c
    LEFT JOIN \`${usersTable}\` u ON c.owner = u.user_id
  `;
};

const getAllCats = async () => {
  const baseCatSelect = await buildBaseCatSelect();
  const [rows] = await promisePool.query(`${baseCatSelect} ORDER BY c.cat_id`);
  return rows;
};

const getCatById = async id => {
  const baseCatSelect = await buildBaseCatSelect();
  const [rows] = await promisePool.query(`${baseCatSelect} WHERE c.cat_id = ?`, [id]);
  return rows[0] || null;
};

const getCatsByUserId = async userId => {
  const baseCatSelect = await buildBaseCatSelect();
  const [rows] = await promisePool.query(
    `${baseCatSelect} WHERE c.owner = ? ORDER BY c.cat_id`,
    [userId]
  );
  return rows;
};

const addCat = async cat => {
  const catsTable = await getCatsTable();
  const [result] = await promisePool.query(
    `INSERT INTO \`${catsTable}\` (cat_name, birthdate, weight, owner, filename)
     VALUES (?, ?, ?, ?, ?)`,
    [cat.name, cat.birthdate, cat.weight, cat.owner, cat.filename ?? '']
  );

  return getCatById(result.insertId);
};

const updateCat = async (id, cat, user) => {
  const catsTable = await getCatsTable();
  const values = [cat.name, cat.birthdate, cat.weight, cat.owner, id];
  let sql = `
    UPDATE \`${catsTable}\`
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
  const catsTable = await getCatsTable();
  let sql = `DELETE FROM \`${catsTable}\` WHERE cat_id = ?`;
  const values = [id];

  if (user.role !== 'admin') {
    sql += ' AND owner = ?';
    values.push(user.user_id);
  }

  const [result] = await promisePool.query(sql, values);
  return result.affectedRows;
};

export {getAllCats, getCatById, getCatsByUserId, addCat, updateCat, deleteCat};
