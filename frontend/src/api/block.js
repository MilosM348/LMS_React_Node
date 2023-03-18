import { apiDelete, apiGet, apiPost } from './index'

async function attach(studentId, assignmentId) {
  try {
    let assignmentTmp = await apiPost(`/api/studentBlock/filter`,
      {
        studentID: studentId,
        assignmentID: assignmentId
      })
    if (assignmentTmp.length !== 0)
      return Promise.resolve({ message: 'block is exist.' })
    await apiPost(`/api/studentBlock`, {
      studentID: studentId,
      assignmentID: assignmentId,
    });
    
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function detach(studentId, assignmentId) {
  try {
    let assignmentTmp = await apiPost(`/api/studentBlock/filter`, {
      studentID: studentId,
      assignmentID: assignmentId,
    });
    if (assignmentTmp.length === 0)
      return Promise.resolve({ message: 'block is not exist' })
    await apiDelete(`/api/studentBlock/${assignmentTmp[0]._id}`)    
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getBlockAssignments(studentId) {
  try {
    let res = await apiPost(`/api/studentBlock/filter`, {
      studentID: studentId
    })
    res = await Promise.all(res.map(async (item) => {
      let assignment = await apiGet(`/api/assignment/${item.assignmentID}`)
      return assignment
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getBlocks(studentId) {
  try {
    let res = apiPost(`/api/studentBlock/filter`, {
      studentID: studentId
    })
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  attach,
  detach,
  getBlockAssignments,
  getBlocks,
}
