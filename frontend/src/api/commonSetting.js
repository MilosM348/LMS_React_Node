import { apiPost, apiGet, apiPut } from './index'

async function create(data) {
  try {
    await apiPost(`/api/commonSetting`, data)
    
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPut(`/api/commonSetting/${data._id}`, data)
    
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let common = await apiGet(`/api/commonSetting/${id}`)
    return Promise.resolve(common)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    const res = await apiGet(`/api/commonSetting`)
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  create,
  update,
  get,
  getAll,
}
