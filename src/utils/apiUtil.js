import axios from 'axios';
import Cookies from 'universal-cookie';

const cookieLoad = cookieName => {
  const cookies = new Cookies();
  return cookies.get(cookieName);
};


export function fetch(url, pathParam) {

  return axios.get(url + pathParam, {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad('token')}
  });
}

export function store(url, pathParam, data) {
  return axios.post(url + pathParam, data, {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad('token')}
  });
}

export function update(url, pathParam, data) {
  return axios.put(url + pathParam, data, {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad('token')}
  });
}

export function destroy(url, pathParam) {
  return axios.delete(url + pathParam, {
    headers: {'Authorization': 'Bearer' + ' ' + cookieLoad('token')}
  });
}
