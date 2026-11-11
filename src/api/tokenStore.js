let token = null;

export const tokenStore = {
  getToken() {
    return token;
  },
  setToken(value) {
    token = value;
  },
  clear() {
    token = null;
  },
};
