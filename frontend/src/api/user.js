import {
  apiGet, apiPost, apiGetToken, apiPostToken, apiPutToken, apiDeleteToken
} from './index'

async function create(data) {
  try {
    let user = await apiPostToken(`/api/user`, data)
    let replits = await apiPostToken(`/api/replit/filter`, {
      userID: ''
    })
    if (replits.length !== 0) {
      let tmp = {}
      tmp._id = replits[0]._id
      tmp.userID = user._id
      await apiPutToken(`/api/replit/${tmp._id}`, tmp)
    }
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPutToken(`/api/user/${data._id}`, data)
    
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    const user = await apiGetToken(`/api/user/${id}`)
    return Promise.resolve(user)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByName(name) {
  try {
    let users = await apiPostToken(`/api/user/filter`, {
      name: name,
    })
    return Promise.resolve(users)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let users = await apiPostToken(`/api/user/filter`, filter)
    return Promise.resolve(users)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    const users = await apiGetToken(`/api/user`)
    return Promise.resolve(users)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDeleteToken(`/api/user/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getByPagination(row, from) {
  try {
    let users = []
    return Promise.resolve(users)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getStudents(companyId = "") {
  try {
    let filter = {}
    if (companyId !== '') {
      filter.companyID = companyId
    }
    filter.role = 'student'
    let users = await apiPostToken(`/api/user/filter`, filter)
    users = await Promise.all(users.map(async (item) => {
      let assignments = await apiPostToken(`/api/assignmentStudent/filter`, {
        studentID: item._id,
        state: 'ongoing'
      })
      let assignment = {}
      if (assignments.length !== 0) {
        const assignmentStudent = assignments[0]
        const assignmentTmp = await apiGet(`/api/assignment/${assignmentStudent?.assignmentID}`)
        assignment = assignmentTmp
        const level = await apiGet(`/api/level/${assignmentStudent?.levelID}`)
        assignment.level = level
        const part = await apiGet(`/api/part/${assignment?.level?.partID}`)
        assignment.part = part
      }
      item.assignment = assignment
      const blocks = await apiPost(`/api/studentBlock/filter`, {
        studentID: item._id
      })
      item.blocks = blocks
      return item
    }))
    return Promise.resolve(users)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getTeachers(companyId = "") {
  try {
    let filter = {}
    if (companyId !== '')
      filter.companyID = companyId
    filter.role = 'owner'
    let users = await apiPostToken(`/api/user/filter`, filter);
    users = await Promise.all(
      users.map(async (item) => {
        let assignments = await apiPostToken(`/api/assignment/filter`, {
          ownerID: item._id,
        });
        item.assignments = assignments;
        return item;
      })
    );
    return Promise.resolve(users);
  } catch (error) {
    return Promise.reject(error);
  }
}

export {
  create,
  update,
  remove,
  get,
  getByName,
  getFilter,
  getAll,
  getByPagination,
  getStudents,
  getTeachers,
};