export const LS = {
    setToken(token) {
        localStorage.setItem('token', token)
    },
    getToken() {
        return localStorage.getItem('token')    
    },
    clearToken() {
        localStorage.clear()
    }
}