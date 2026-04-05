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

const getAllUsers = async () => {
  const usersTable = await getUsersTable();
  const [rows] = await promisePool.query(
    `SELECT user_id, name, username, email, role FROM \`${usersTable}\` ORDER BY user_id`
  );
  return rows;
};

const getUserById = async id => {
  const usersTable = await getUsersTable();
  const [rows] = await promisePool.query(
    `SELECT user_id, name, username, email, role FROM \`${usersTable}\` WHERE user_id = ?`,
    [id]
  );
  return rows[0] || null;
};

const addUser = async user => {
  const usersTable = await getUsersTable();
  const [result] = await promisePool.query(
    `INSERT INTO \`${usersTable}\` (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)`,
    [
      user.name,
      user.username,
      user.email,
      user.password,
      user.role ?? 'user',
    ]
  );
  return getUserById(result.insertId);
};

const findUserByUsername = async username => {
  const usersTable = await getUsersTable();
  const [rows] = await promisePool.query(
    `SELECT * FROM \`${usersTable}\` WHERE username = ? LIMIT 1`,
    [username]
  );
  return rows[0] || null;
};

const updateUser = async (id, user, currentUser) => {
  if (currentUser.role !== 'admin' && currentUser.user_id !== id) {
    return null;
  }

  const usersTable = await getUsersTable();
  const [result] = await promisePool.query(
    `UPDATE \`${usersTable}\`
     SET name = ?, username = ?, email = ?, role = ?
     WHERE user_id = ?`,
    [
      user.name,
      user.username,
      user.email,
      currentUser.role === 'admin' ? user.role ?? 'user' : currentUser.role,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getUserById(id);
};

const deleteUser = async (id, currentUser) => {
  if (currentUser.role !== 'admin' && currentUser.user_id !== id) {
    return 0;
  }

  const connection = await promisePool.getConnection();
  const usersTable = await getUsersTable();
  const catsTable = await getCatsTable();

  try {
    await connection.beginTransaction();
    await connection.query(`DELETE FROM \`${catsTable}\` WHERE owner = ?`, [id]);
    const [deleteResult] = await connection.query(
      `DELETE FROM \`${usersTable}\` WHERE user_id = ?`,
      [id]
    );
    await connection.commit();
    return deleteResult.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export {
  getAllUsers,
  getUserById,
  addUser,
  findUserByUsername,
  updateUser,
  deleteUser,
};
