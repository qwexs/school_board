import Api from "./api";
import routes from "../routes";
import store from "../../store";

export function getAPI() {
    const routerName = getRouterName();
    return store.getState().hasOwnProperty(routerName) && new Api(routerName);
}

export function getRouterName() {
    const {pathname} = store.getState().router.location;
    return routes.find(v => v.path === pathname).name;
}

export default getAPI;
