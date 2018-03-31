import axios from 'axios';
import Cookies from 'universal-cookie';
import { TOKEN } from 'constants/api';
import * as Converter from './converter';
import * as api from '../constants/api';


const cookieLoad = cookieName => {
  const cookies = new Cookies();
  return cookies.get(cookieName);
};

export function fetch(pathParam, data) {
  return axios.get(api.API_ROOT + pathParam.toLowerCase(), {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad(TOKEN)}
  });
}

export function store(resourceName, data) {
  return axios.post(api.API_ROOT + resourceName.toLowerCase(), data, {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad(TOKEN)}
  });
}

export function update(resourceName, data, dataId) {
  return axios.put(api.API_ROOT + Converter.getPathParam(resourceName.toLowerCase(), dataId), data, {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad(TOKEN)}
  });
}

export function destroy(resourceName, dataId) {
  return axios.delete(api.API_ROOT + Converter.getPathParam(resourceName.toLowerCase(), dataId), {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad(TOKEN)}
  });
}
