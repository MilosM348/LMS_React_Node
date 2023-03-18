import { apiDelete, apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/program`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/program/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/program/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/program/${id}`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/program`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getFilter(filter) {
  try {
    let programs = await apiPost(`/api/program/filter`, filter)
    return Promise.resolve(programs)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFirstRow(levelId, row) {
  try {
    let programs = []
    return Promise.resolve(programs)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByPagination(levelId, row, from) {
  try {
    let programs = []
    return Promise.resolve(programs)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByLevelId(id) {
  try {
    let programs = await apiPost(`/api/program/filter`, {
      levelID: id,
    })
    return Promise.resolve(programs)
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  create,
  update,
  remove,
  get,
  getFilter,
  getAll,
  getFirstRow,
  getByPagination,
  getByLevelId,
}
