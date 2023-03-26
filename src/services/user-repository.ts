import { createStringId } from "../utils/createId";
import { validateUserData } from "../utils/validateData";

interface User {
  id?: string;
  email: string;
  password: string;
}

let usersData: User[] = [
  {
    id: '1234567',
    email: 'example@example.com',
    password: 'password'
  },
  {
    id: '1234568',
    email: 'example2@example.com',
    password: 'password2'
  }
];

interface UserRepositoryService {
  findUserById: (id: string) => Promise<User | undefined>;
  createUser: (user: User) => Promise<boolean>;
  deleteUser: (user: User) => Promise<boolean>;
  updateUser: (user: User) => Promise<User | undefined>;
}

let userRepositoryService: UserRepositoryService = {
  
  findUserById: async function (id: string): Promise<User | undefined> {
    const user = usersData.filter(user => user.id === id).at(0);
    return user;
  },

  createUser: async function (newUser: User) {
    if (!validateUserData(newUser)) return false;
    const id = createStringId(7);
    usersData.push({ id, ...newUser })
    return true;
  },

  deleteUser: async function (userToBeDeleted: User): Promise<boolean> {
    const indexOfUser = usersData.findIndex(user => user.id == userToBeDeleted.id)
    if (indexOfUser <= -1) return false;
    usersData.splice(indexOfUser, 1);
    return true;
  },

  updateUser: async function (userUpdate: User): Promise<User | undefined> {
    const indexOfUser = usersData.findIndex(user => user.id == userUpdate.id)
    if (indexOfUser != -1 && validateUserData(userUpdate)) {
      usersData[indexOfUser] = { ...usersData[indexOfUser], ...userUpdate };
      return usersData[indexOfUser]
    }
  }
}

export default userRepositoryService
export { User }

