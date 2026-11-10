let accessToken = null;
let csrfToken = null;

export const tokenStore = {
  getAccessToken() {
    return accessToken;
  },
  setAccessToken(value) {
    accessToken = value;
  },
  getCsrfToken() {
    return csrfToken;
  },
  setCsrfToken(value) {
    csrfToken = value;
  },
  clear() {
    accessToken = null;
    csrfToken = null;
  },
};
