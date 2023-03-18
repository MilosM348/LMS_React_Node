import { apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/iconBox`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/iconBox/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/iconBox/${id}`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/iconBox`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

export {
  create,
  update,
  get,
  getAll,
}
