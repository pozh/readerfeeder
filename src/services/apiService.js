// Import utils
import * as ApiUtil from '../utils/apiUtil';
import * as Converter from '../utils/converter';

import * as api from '../constants/api';

export function fetch(pathParam, data) {
  return ApiUtil.fetch(api.API_URL, pathParam.toLowerCase());
}

export function store(resourceName, data) {
  return ApiUtil.store(api.API_URL, resourceName.toLowerCase(), data);
}

export function update(resourceName, data, dataId) {
  return ApiUtil.update(api.API_URL, Converter.getPathParam(resourceName.toLowerCase(), dataId), data);
}

export function destroy(resourceName, dataId) {
  return ApiUtil.destroy(api.API_URL, Converter.getPathParam(resourceName.toLowerCase(), dataId));
}
