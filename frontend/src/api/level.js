import { apiDelete, apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/level`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/level/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/level/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/level/${id}`)
    const part = await apiGet(`/api/part/${res.partID}`)
    res.part = part
    const assignment = await apiGet(`/api/assignment/${res?.part?.assignmentID}`)
    res.assignment = assignment
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/level/filter`, filter)
    res =  await Promise.all(res.map( async (item) => {
      const part = await apiGet(`/api/part/${item?.partID}`)
      item.part = part
      const assignment = await apiGet(`/api/assignment/${item?.part?.assignmentID}`)
      item.assignment = assignment
      let programs = await apiPost(`/api/program/filter`, {
        levelID: item.id
      })
      item.programs = programs
      return item
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/level`)
    res =  await Promise.all(res.map( async (item) => {
      const part = await apiGet(`/api/part/${item?.partID}`)
      item.part = part
      const assignment = await apiGet(`/api/assignment/${item?.part?.assignmentID}`)
      item.assignment = assignment
      let programs = await apiPost(`/api/program/filter`, {
        levelID: item.id
      })
      item.programs = programs
      return item
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFirstRow(partId, row) {
  try {
    let res = []
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByPagination(partId, row, from) {
  try {
    let res = []
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByPartId(id) {
  try {
    let res = await apiPost(`/api/level/filter`, {
      partID: id
    })
    res =  await Promise.all(res.map( async (item) => {
      const part = await apiGet(`/api/part/${item?.partID}`)
      item.part = part
      const assignment = await apiGet(`/api/assignment/${item?.part?.assignmentID}`)
      item.assignment = assignment
      let programs = await apiPost(`/api/program/filter`, {
        levelID: item.id
      })
      item.programs = programs
      return item
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByStudentId(assignmentId, studentId) {
  try {
    let assignmentStudents = await apiPost(`/api/assignmentStudent/filter`, {
      assignmentID: assignmentId,
      studentID: studentId,
    })
    if (assignmentStudents.length !== 0) {
      let level = await apiGet(`/api/level/${assignmentStudents[0].levelID}`)
      const part = await apiGet(`/api/part/${level?.partID}`)
      level.part = part
      const assignment = await apiGet(`/api/assignment/${part?.assignmentID}`)
      level.assignment = assignment
      let tmp = assignmentStudents[0]
      return Promise.resolve({level: level, assignmentStudent: tmp})
    }
    return Promise.resolve(null)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function setState(data) {
  try {
    await apiPut(`/api/assignmentStudent/${data?._id}`, data)
    
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  create,
  update,
  remove,
  getFilter,
  get,
  getAll,
  getFirstRow,
  getByPagination,
  getByPartId,
  getByStudentId,
  setState,
}
