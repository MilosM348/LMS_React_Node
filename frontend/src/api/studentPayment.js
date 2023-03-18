import { apiDelete, apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/studentPayment`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/studentPayment/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/studentPayment/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/studentPayment/${id}`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/studentPayment`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getFilter(filter) {
  try {
    let programs = await apiPost(`/api/studentPayment/filter`, filter);
    return Promise.resolve(programs);
  } catch (error) {
    return Promise.reject(error);
  }
}

export {
  create,
  update,
  remove,
  get,
  getAll,
  getFilter,
}
