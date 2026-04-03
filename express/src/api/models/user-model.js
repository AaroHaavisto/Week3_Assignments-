const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3610,
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@metropolia.fi',
    role: 'admin',
    password: 'password123',
  },
];

const getAllUsers = () => userItems;

const getUserById = id => userItems.find(user => user.user_id === id);

const addUser = user => {
  const newUser = {
    user_id: userItems.length
      ? Math.max(...userItems.map(item => item.user_id)) + 1
      : 1,
    ...user,
  };
  userItems.push(newUser);
  return newUser;
};

export {getAllUsers, getUserById, addUser};
