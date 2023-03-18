import { apiDelete, apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/partGroup`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/partGroup/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/partGroup/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function replace(sourceId, parts) {
  try {
    let preGroup = await apiPost(`/api/partGroup/filter`, {
      sourceID: sourceId,
    })
    await Promise.all(preGroup.map(async (item) => {
      await apiDelete(`/api/part/${item?._id}`)
    }))
    await Promise.all(parts.map(async (item) => {
      await apiPost(`/api/partGroup`, {
        sourceID: sourceId,
        partID: item.id,
      })
    }))
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function attach(sourceId, parts) {
  try {
    await Promise.all(parts.map(async (item) => {
      await apiPost(`/api/partGroup`, {
        sourceID: sourceId,
        partID: item.id,
      })
    }))
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/partGroup/${id}`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/partGroup`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

export {
  create,
  update,
  remove,
  attach,
  replace,
  get,
  getAll,
}
