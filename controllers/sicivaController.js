const axios = require('axios').default;
const axiosCookieJarSupport = require("axios-cookiejar-support").wrapper;
const qs = require('qs');
const { CookieJar, Cookie } = require("tough-cookie");
axiosCookieJarSupport(axios);


const cookieJar = new CookieJar();

axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;
axios.defaults.maxRedirects = 5;

async function fetch_Url(payload) {
    const { url, data } = payload;
    try {
        axios.post(url, qs.stringify(data))
            .then(response => {
                console.log(response);
                return response.data;
            })
            .catch(error => {
                console.error(error);
                return [];
            });
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = {
    fetch_Url
}