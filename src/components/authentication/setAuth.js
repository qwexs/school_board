import axios from "axios";
import Cookies from 'universal-cookie'

const cookies = new Cookies();

export const setAuth = {
    isAuthenticated: false,
    signIn(params, response) {
        axios.post(process.env.PROXY+'/user/auth', params, {withCredentials: true}).then(resolve => {
            const {valid, token} = resolve.data;
            if (valid) {
                cookies.remove("iboard");
                cookies.set("iboard", {token}, {path: '/', maxAge : 604800000});
            }
            this.isAuthenticated = valid;
            response.call(null,  valid);
        });
    },
    newPassword(params, response) {
        axios.put(process.env.PROXY+'/user/auth', params).then(resolve => {
            response.call(null,  resolve.data.valid);
        });
    },
    getSession(response) {
        console.log(process.env.PROXY);
        axios.get(process.env.PROXY+'/user/auth', {withCredentials: true}).then(resolve => {
            const {token} = resolve.data;
            const currentToken = cookies.get('iboard');
            const valid = currentToken && currentToken.token === token;
            this.isAuthenticated = valid;
            response.call(null, valid);
        });
    },
    signOut(response) {
        this.isAuthenticated = false;
        cookies.remove("iboard");
        axios.get(process.env.PROXY+'/user/auth/logout').then(() => {
            response.call();
        });
    }
};
