import axios from 'axios';
import * as Converter from './converter';


// NB. Bearer authorization header is already set on user login or authCheck

export function fetch(pathParam) {
  return axios.get(API_ROOT+'/'+pathParam.toLowerCase());
}

export function store(resourceName, data) {
  return axios.post(API_ROOT+'/'+resourceName.toLowerCase(), data);
}

export function update(resourceName, data, dataId) {
  const pathParam = Converter.getPathParam(resourceName.toLowerCase(), dataId);
  return axios.put(API_ROOT+'/'+pathParam, data);
}

export function destroy(resourceName, dataId) {
  const pathParam = Converter.getPathParam(resourceName.toLowerCase(), dataId);
  return axios.delete(API_ROOT+'/'+pathParam);
}
