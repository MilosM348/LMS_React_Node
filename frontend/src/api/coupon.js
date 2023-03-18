import { apiDelete, apiGet, apiPost, apiPut } from './index'

async function create(data) {
  try {
    await apiPost(`/api/coupon`, data)
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPut(`/api/coupon/${data._id}`, data)
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/coupon/${id}`)
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function attach(priceId, codes, isFree, discount) {
  try {
    await Promise.all(codes.map(async (code) => {
      await apiPost(`/api/coupon`, {
        priceID: priceId,
        code: code,
        isFree: isFree,
        discountPercentage: discount,
      })
    }))
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/coupon/${id}`)
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/coupon`)
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/coupon`, filter)
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  create,
  update,
  remove,
  attach,
  get,
  getAll,
  getFilter,
}
