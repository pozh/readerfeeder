import axios from 'axios';
import Cookies from 'universal-cookie';
import { TOKEN } from 'constants/api';
import * as Converter from './converter';
import * as api from '../constants/api';


const cookieLoad = cookieName => {
  const cookies = new Cookies();
  return cookies.get(cookieName);
};

export function getAuthorized(path) {
  return axios.get(path, {
    headers: { Authorization: `Bearer ${cookieLoad(TOKEN)}` }
  });
}

export function fetch(pathParam) {
  return axios.get(api.API_ROOT + pathParam.toLowerCase(), {
    headers: { Authorization: `Bearer ${cookieLoad(TOKEN)}` }
  });
}

export function store(resourceName, data) {
  return axios.post(api.API_ROOT + resourceName.toLowerCase(), data, {
    headers: { Authorization: `Bearer ${cookieLoad(TOKEN)}` }
  });
}

export function update(resourceName, data, dataId) {
  const pathParam = Converter.getPathParam(resourceName.toLowerCase(), dataId);
  return axios.put(api.API_ROOT + pathParam, data, {
    headers: { Authorization: `Bearer ${cookieLoad(TOKEN)}` }
  });
}

export function destroy(resourceName, dataId) {
  const pathParam = Converter.getPathParam(resourceName.toLowerCase(), dataId);
  return axios.delete(api.API_ROOT + pathParam, {
    headers: { Authorization: `Bearer ${cookieLoad(TOKEN)}` }
  });
}
