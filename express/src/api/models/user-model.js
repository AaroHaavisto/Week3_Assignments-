import promisePool from '../utils/database.js';

const getAllUsers = async () => {
  const [rows] = await promisePool.query(
    'SELECT user_id, name, username, email, role FROM `user` ORDER BY user_id'
  );
  return rows;
};

const getUserById = async id => {
  const [rows] = await promisePool.query(
    'SELECT user_id, name, username, email, role FROM `user` WHERE user_id = ?',
    [id]
  );
  return rows[0] || null;
};

const addUser = async user => {
  const [result] = await promisePool.query(
    'INSERT INTO `user` (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
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
  const [rows] = await promisePool.query(
    'SELECT * FROM `user` WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] || null;
};

const updateUser = async (id, user, currentUser) => {
  if (currentUser.role !== 'admin' && currentUser.user_id !== id) {
    return null;
  }

  const [result] = await promisePool.query(
    `UPDATE \`user\`
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

  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM cat WHERE owner = ?', [id]);
    const [deleteResult] = await connection.query(
      'DELETE FROM `user` WHERE user_id = ?',
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
