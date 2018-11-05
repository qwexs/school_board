export const setAuth = {
    isAuthenticated: false,
    signIn(response) {
        this.isAuthenticated = true;
        setTimeout(response, 100);
    },
    signOut(response) {
        this.isAuthenticated = false;
        setTimeout(response, 100);
    }
};
