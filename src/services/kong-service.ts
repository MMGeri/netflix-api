import axios from "axios";
require("dotenv").config();

interface KongService {
    getConsumer: (username: string) => Promise<any>;
    createConsumer: (username: string) => Promise<any>;
    addUserToAcl: (consumer: string, group: "user" | "admin") => Promise<any>;
    createApiKey: (consumer: string) => Promise<any>;
    getApiKeysOfUser(consumer: string): Promise<any>;
    deleteApiKey(consumer: string, key: string): Promise<any>;
}

let kongService: KongService = {
    getConsumer: async function (username: string): Promise<any> {
        return await axios.get(`${process.env.KONG_API}/consumers/${username}`).then(response => response?.data);
    },
    createConsumer: async function (username: string): Promise<any> {
        return await axios.post(`${process.env.KONG_API}/consumers`, {username}).then(response => response?.data);
    },
    addUserToAcl: async function (consumer: string, group: string): Promise<any> {
        return await axios.post(`${process.env.KONG_API}/consumers/${consumer}/acls`, {group}).then(response => response?.data);
    },
    createApiKey: async function (consumer: string): Promise<any> {
        return await axios.post(`${process.env.KONG_API}/consumers/${consumer}/key-auth`).then(response => response?.data);
    },
    getApiKeysOfUser: async function (consumer: string): Promise<any> {
        return await axios.get(`${process.env.KONG_API}/consumers/${consumer}/key-auth`).then(response => response?.data);
    },
    deleteApiKey: async function (consumer: string, key: string): Promise<any> {
        return await axios.delete(`${process.env.KONG_API}/consumers/${consumer}/key-auth/${key}`).then(response => response?.data);
    }
}

//FIXME: átírni mindent működőképesre, és a paramétereket is átírni stb
export default kongService;
