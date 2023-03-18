import { apiDelete, apiGet, apiGetToken, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/newComment`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/newComment/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/newComment/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/newComment/${id}`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/newComment`)
    res.sort((a, b) => {
      let comparison = 0;
      if (a._id > b._id) {
        comparison = 1;
      } else if (a._id < b._id) {
        comparison = -1;
      }
      return comparison;
    })
    res = await Promise.all(res.map(async (item) => {
      const comment = await apiGet(`/api/comment/${item.commentID}`)
      item.comment = comment
      const user = await apiGetToken(`/api/user/${item.userID}`)
      item.user = user
      const level = await apiGet(`/api/level/${item.levelID}`)
      item.level = level
      const part = await apiGet(`/api/part/${level?.partID}`)
      item.part = part
      const assignment = await apiGet(`/api/assignment/${part?.assignmentID}`)
      item.assignment = assignment
      return item
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/newComment/filter`, filter)
    res.sort((a, b) => {
      let comparison = 0;
      if (a._id > b._id) {
        comparison = 1;
      } else if (a._id < b._id) {
        comparison = -1;
      }
      return comparison;
    })
    res = await Promise.all(res.map(async (item) => {
      const comment = await apiGet(`/api/comment/${item.commentID}`)
      item.comment = comment
      const user = await apiGetToken(`/api/user/${item.userID}`)
      item.user = user
      const level = await apiGet(`/api/level/${item.levelID}`)
      item.level = level
      const part = await apiGet(`/api/part/${level?.partID}`)
      item.part = part
      const assignment = await apiGet(`/api/assignment/${part?.assignmentID}`)
      item.assignment = assignment
      return item
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByPagination(row, from, sort) {
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