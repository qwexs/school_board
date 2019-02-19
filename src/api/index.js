import store from "../configureStore";
import {ScheduleAPI} from "./schedule.api";


export function getAPI() {
    let api = new ScheduleAPI();
    return api;
}

export default getAPI;
