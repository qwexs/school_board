import Api from "./api";
import routes from "../routes";
import store from "../../store";

export function getAPI() {
    return new Api(getRouterName());
}

export function getRouterName() {
    const {pathname} = store.getState().router.location;
    return routes.find(v => v.path === pathname).name;
}

export default getAPI;
