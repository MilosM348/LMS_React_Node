import { apiDelete, apiGet, apiGetToken, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/examPool`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/examPool/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/examPool/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/examPool/${id}`)
    const student = await apiGetToken(`/api/user/${res.studentID}`)
    res.student = student
    const assignment = await apiGet(`/api/assignment/${res.assignmentID}`)
    res.assignment = assignment
    const level = await apiGet(`/api/level/${res.levelID}`)
    res.level = level
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getBy(levelId, studentId) {
  try {
    let res = await apiPost(`/api/examPool/filter`, {
      levelID: levelId,
      studentID: studentId,
    })
    res = await Promise.all(res.map(async (item) => {
      const exam = await apiGet(`/api/exam/${item.examID}`)
      item.exam = exam
      return item
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByPagination(row, from) {
  try {
    let res = []
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/examPool`)
    res =  await Promise.all(res.map( async (item) => {
      const student = await apiGetToken(`/api/user/${item.studentID}`);
      item.student = student;
      const assignment = await apiGet(`/api/assignment/${item.assignmentID}`);
      item.assignment = assignment;
      const level = await apiGet(`/api/level/${item.levelID}`);
      item.level = level;
      const exam = await apiGet(`/api/exam/${item.examID}`);
      item.exam = exam;
      const part = await apiGet(`/api/part/${level.partID}`);
      item.part = part;
      let parts = await apiPost(`/api/part/filter`, {
        assignmentID: item.assignmentID
      });
      parts = await Promise.all(parts.map(async (part) => {
        let levels = await apiPost(`/api/level/filter`, {
          partID: part.id
        })
        part.levels = levels
        return part
      }))
      item.parts = parts
      return item
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/examPool/filter`, filter)
    res =  await Promise.all(res.map( async (item) => {
      const student = await apiGetToken(`/api/user/${item.studentID}`);
      item.student = student;
      const assignment = await apiGet(`/api/assignment/${item.assignmentID}`);
      item.assignment = assignment;
      const level = await apiGet(`/api/level/${item.levelID}`);
      item.level = level;
      const exam = await apiGet(`/api/exam/${item.examID}`);
      item.exam = exam;
      const part = await apiGet(`/api/part/${level.partID}`);
      item.part = part;
      let parts = await apiPost(`/api/part/filter`, {
        assignmentID: item.assignmentID
      });
      parts = await Promise.all(parts.map(async (part) => {
        let levels = await apiPost(`/api/level/filter`, {
          partID: part.id
        })
        part.levels = levels
        return part
      }))
      item.parts = parts
      return item
    }))
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
  getBy,
  getByPagination,
}