import { apiGet, apiPost, apiPut, apiDelete } from './index'

async function create(data) {
  try {
    await apiPost("/api/subject", data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPut(`/api/subject/${data._id}`, data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/subject/${id}`);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    const res = await apiGet(`/api/subject/${id}`);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    const res = await apiGet(`/api/subject`);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    const res = await apiPost(`/api/subject/filter`, filter);
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
