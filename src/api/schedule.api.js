import axios from "axios";
import Api from "./api";

export class ScheduleAPI extends Api {

    constructor() {
        super();
    }

    async getAll() {
        return (await axios.get('/schedule')).data;
    }

    async getById(id) {
        return (await axios.get(`/schedule/${id}`)).data;
    }

    async setById(id, data) {
        return (await axios.put(`/schedule/${id}`, data)).data;
    }

    async create(name) {
        return (await axios.post("/schedule", {name})).data;
    }

    async removeById(id) {
        return (await axios.delete(`/schedule/${id}`)).data;
    }
}
