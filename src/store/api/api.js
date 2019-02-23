import axios from "axios";

export default class Api {

    constructor(path) {
        this.path = path;
    }

    getList = async () => (await axios.get(`/${this.path}`)).data;

    getItem = async (id) => (await axios.get(`/${this.path}/${id}`)).data;

    setItem = async (id, data) => (await axios.put(`/${this.path}/${id}`, data)).data;

    createItem = async (data) => (await axios.post(`/${this.path}`, data)).data;

    removeItem = async (id) => (await axios.delete(`/${this.path}/${id}`)).data;

   /* async getList() {
        return null;
    }

    async getItem(id) {
        return null;
    }

    async setItem(id, data) {
        return null;
    }

    async createItem(name) {
        return null;
    }

    async removeItem(id) {
        return null;
    }*/
};
