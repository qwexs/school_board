import axios from "axios";

export default class Api {

    constructor(path) {
        this.path = path;
    }

    getList = async () => (await axios.get(`/${this.path}`)).data;

    getItem = async (id) => (await axios.get(`/${this.path}/${id}`)).data;

    setItem = async (id, data, config) => (await axios.put(`/${this.path}/${id}`, data, config)).data;

    createItem = async (data, config) => (await axios.post(`/${this.path}`, data, config)).data;

    insertItem = async (id, data, config) => (await axios.post(`/${this.path}/${id}`, data, config)).data;

    patchItem = async (id, data) => (await axios.patch(`/${this.path}/${id}`, data)).data;

    removeItem = async (id) => (await axios.delete(`/${this.path}/${id}`)).data;

};
