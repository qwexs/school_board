import store from "../configureStore";
import Api from "./api";
import routes from "../routes";

export function getAPI() {
    const {pathname} = store.getState().router.location;
    const name = routes.find(v => v.path === pathname).name;
    return new Api(name);
}

export default getAPI;
