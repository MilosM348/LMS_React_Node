import { apiDelete, apiGet, apiGetToken, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/replit`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/replit/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/replit/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/replit/${id}`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/replit/filter`, filter);
    res = await Promise.all(res.map(async (item) => {
      const user = await apiGetToken(`/api/user/${item.userID}`)
      item.user = user
      return item
    }))
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/replit`);
    res = await Promise.all(res.map(async (item) => {
      const user = await apiGetToken(`/api/user/${item.userID}`)
      item.user = user
      return item
    }))
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getByPagination(row, from) {
  try {
    let res = []
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  create,
  update,
  remove,
  get,
  getAll,
  getFilter,
  getByPagination,
}
