import { Video } from "./videos-service";
import videoService from "./videos-service";

type User = {
  id: number;
  email: string;
  password: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type NewUser = Omit<User, "id">


let usersData: User[] = [
  {
    id: 1,
    email: 'example@example.com',
    password: 'password'
  },
  {
    id: 2,
    email: 'example2@example.com',
    password: 'password2'
  }
];

let lastId = 2;
function getNextId(): number {
  return ++lastId;
}

interface UserRepositoryService {
  findUserById: (userId: number) => Promise<User | undefined>;
  createUser: (user: NewUser) => Promise<User>;
  deleteUser: (userId: number) => Promise<boolean>;
  updateUser: (userId:number,user: NewUser) => Promise<User | undefined>;
}

let userRepositoryService: UserRepositoryService = {
  findUserById: async function (id: number): Promise<User | undefined> {
    const user = usersData.filter(user => user.id === id).at(0);
    return user;
  },

  createUser: async function (newUser: NewUser) {
    const newId = getNextId();
    const user = { id: newId, ...newUser };
    usersData.push(user)
    return user;
  },

  deleteUser: async function (id: number) {
    const indexOfUser = usersData.findIndex(user => user.id == id)
    if (indexOfUser <= -1) return false;
    usersData.splice(indexOfUser, 1);
    return true;
  },

  updateUser: async function (userId:number,userUpdate: NewUser){
    const indexOfUser = usersData.findIndex(user => user.id == userId)
    if (indexOfUser != -1) {
      usersData[indexOfUser] = { ...usersData[indexOfUser], ...userUpdate };
      return usersData[indexOfUser]
    }
  }
}



export default userRepositoryService
export { User, NewUser }

