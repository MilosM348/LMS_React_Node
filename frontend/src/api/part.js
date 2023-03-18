import { apiDelete, apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/part`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/part/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/part/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let part = await apiGet(`/api/part/${id}`)
    const assignment = await apiGet(`/api/assignment/${part?.assignmentID}`)
    part.assignment = assignment
    return Promise.resolve(part)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let parts = await apiPost(`/api/part/filter`, filter)
    return Promise.resolve(parts)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let parts = await apiGet(`/api/part`)
    parts = await Promise.all(parts.map(async (item) => {
      const assignment = await apiGet(`/api/assignment/${item?.assignmentID}`)
      item.assignment = assignment
      let levels = await apiPost(`/api/level/filter`, {
        partID: item.id,
      })
      item.levels = levels
      return item
    }))
    return Promise.resolve(parts)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByAssignmetId(id) {
  try {
    let parts = await apiPost(`/api/part/filter`, {
      assignmentID: id,
    })
    parts.sort((a, b) => {
      let comparison = 0;
      if (a.name > b.name) {
        comparison = 1;
      } else if (a.name < b.name) {
        comparison = -1;
      }
      return comparison;
    })
    parts =  await Promise.all(parts.map( async (item) => {
      const assignment = await apiGet(`/api/assignment/${item.assignmentID}`)
      item.assignment = assignment
      let levels = await apiPost(`/api/level/filter`, {
        partID: item.id
      })
      levels.sort((a, b) => {
        let comparison = 0;
        if (a.name > b.name) {
          comparison = 1;
        } else if (a.name < b.name) {
          comparison = -1;
        }
        return comparison;
      })
      item.levels = levels
      return item
    }))
    return Promise.resolve(parts)
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
  getByAssignmetId,
}
