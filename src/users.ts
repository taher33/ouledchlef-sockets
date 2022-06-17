type User = {
  id: string;
  name: string;
};
const users: User[] | null = [];

export const addUser = ({ id, name }: User) => {
  name.trim().toLowerCase();

  if (!name) return { error: "must specify name" };
  const existingUser = users.findIndex((el) => el.name === name);
  if (existingUser !== -1) return { error: "user already exists" };
  users.push({ id, name });

  console.log("users", users);

  return {
    success: "user added",
  };
};

export const getUser = (name: string) =>
  users.find((user) => user.name === name);

// const getUsersInRoom = (room) => users.filter((user) => user.room === room);