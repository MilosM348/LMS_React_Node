import { apiGet, apiPost, apiPut, apiDelete } from './index'

async function create(data) {
  try {
    const res = await apiPost("/api/company", data);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPut(`/api/company/${data._id}`, data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/company/${id}`);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    const res = await apiGet(`/api/company/${id}`);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    const res = await apiGet(`/api/company`);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let companies = await apiPost(`/api/company/filter`, filter);
    return Promise.resolve(companies);
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
