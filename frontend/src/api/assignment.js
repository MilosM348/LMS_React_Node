import { apiPost, apiGet, apiPut, apiGetToken, apiDelete } from './index'

async function create(data) {
  try {
    await apiPost("/api/assignment", data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPut(`/api/assignment/${data._id}`, data);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/assignment/${id}`);
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let assignment = await apiGet(`/api/assignment/${id}`);
    const owner = await apiGetToken(`/api/user/${assignment.ownerID}`);
    assignment.owner = owner;
    let parts = await apiPost("/api/part/filter", {assignmentID: assignment._id});
    parts.sort((a, b) => {
      let comparison = 0;
      if (a.name > b.name) {
        comparison = 1;
      } else if (a.name < b.name) {
        comparison = -1;
      }
      return comparison;
    })
    parts = await Promise.all(parts.map(async (part) => {
      let levels = await apiPost("/api/level/filter", {partID: part._id});
      levels.sort((a, b) => {
        let comparison = 0;
        if (a.name > b.name) {
          comparison = 1;
        } else if (a.name < b.name) {
          comparison = -1;
        }
        return comparison;
      })
      part.levels = levels
      return part
    }))
    assignment.parts = parts
    return Promise.resolve(assignment)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let assignments = await apiGet("/api/assignment");
    assignments = await Promise.all(assignments.map(async (assignment) => {
      const owner = await apiGetToken(`/api/user/${assignment.ownerID}`);
      assignment.owner = owner
      let parts = await apiPost("/api/part/filter", {assignmentID: assignment._id});
      parts.sort((a, b) => {
        let comparison = 0;
        if (a.name > b.name) {
          comparison = 1;
        } else if (a.name < b.name) {
          comparison = -1;
        }
        return comparison;
      })
      assignment.parts = parts
      return assignment
    }))
    return Promise.resolve(assignments)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let assignments = await apiPost("/api/assignment/filter", filter)
    assignments =  await Promise.all(assignments.map( async (assignment) => {
      const owner = await apiGetToken(`/api/user/${assignment.ownerID}`);
      assignment.owner = owner
      let parts = await apiPost("/api/part/filter", {assignmentID: assignment._id});
      parts.sort((a, b) => {
        let comparison = 0;
        if (a.name > b.name) {
          comparison = 1;
        } else if (a.name < b.name) {
          comparison = -1;
        }
        return comparison;
      })
      assignment.parts = parts
      return assignment
    }))
    return Promise.resolve(assignments)
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
}