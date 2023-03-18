import { apiGet, apiPost, apiPut, apiDelete, apiGetToken } from './index'

async function create(data) {
  try {
    await apiPost("/api/message", data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPut(`/api/message/${data._id}`, data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/message/${id}`);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    const res = await apiGet(`/api/message/${id}`);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    const res = await apiGet(`/api/message`);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/message/filter`, filter);
    return Promise.resolve(res);
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
