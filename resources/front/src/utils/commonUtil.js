/**
 * Is the given object empty?
 * @param obj
 * @return bool
 */
export const isEmpty = obj => (!Object.getOwnPropertyNames(obj).length > 0);
