import axios from 'axios';
import { BE_1_URL } from 'configs/domain.config.js';

class Axios {
  constructor(baseUrl, withCredentials = false) {
    this.instance = axios.create({
      baseURL: baseUrl,
      withCredentials,
    });
  }

  get(url, params) {
    return this.instance.get(url, params);
  }

  post(url, data) {
    return this.instance.post(url, data);
  }
}

const be1 = new Axios(BE_1_URL, true);
const axiosHelper = {
  be1,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default axiosHelper;
