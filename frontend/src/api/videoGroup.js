import { apiGet, apiPost, apiPut, apiDelete } from './index'

async function create(data) {
  try {
    await apiPost("/api/videoGroup", data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPut(`/api/videoGroup/${data._id}`, data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/videoGroup/${id}`);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    const res = await apiGet(`/api/videoGroup/${id}`);
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/videoGroup`);
    res = await Promise.all(res.map( async (item) => {
      if (item.ownerID === -1)
        item.owner = { name: '' }
      else {
        const owner = await apiGet(`/api/user/${item.ownerID}`)
        item.owner = owner
      }
      const groupIDs = item.groupIDs || []
      const groups = await Promise.all(groupIDs.map(async (groupID) => {
        const group = await apiGet(`/api/group/${groupID}`)
        return group
      }))
      item.groups = groups

      return item
    }));
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/videoGroup/filter`, filter);
    res = await Promise.all(res.map( async (item) => {
      if (item.ownerID === -1)
        item.owner = { name: '' }
      else {
        const owner = await apiGet(`/api/user/${item.ownerID}`)
        item.owner = owner
      }
      const groupIDs = item.groupIDs || []
      const groups = await Promise.all(groupIDs.map(async (groupID) => {
        const group = await apiGet(`/api/group/${groupID}`)
        return group
      }))
      item.groups = groups
      
      return item
    }));
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
