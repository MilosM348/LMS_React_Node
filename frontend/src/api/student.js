import { apiDelete, apiGet, apiGetToken, apiPost, apiPostToken, apiPut } from './index'

async function addAssignment(data) {
  try {
    // ongoing assignment
    const ongoingAssignments = await apiPost(`/api/assignmentStudent/filter`, {
      state: 'ongoing',
      studentID: data.studentID,
      companyID: data.companyID,
    })
    // assignment with current assignment id and student id
    const assignments = await apiPost(`/api/assignmentStudent/filter`, {
      assignmentID: data.assignmentID,
      studentID: data.studentID,
    })
    if (assignments.length !== 0)
      return Promise.resolve({message: assignments[0].state})
    if (ongoingAssignments.length !== 0)
      return Promise.resolve({ message: 'The ongoing assignment exist' })
    await apiPost(`/api/assignmentStudent`, data)
    return Promise.resolve({message: 'success'})
  } catch(error) {
    return Promise.reject(error)
  }
}

async function removeWithStudent(studentId, assignmentId) {
  try {
    if (studentId === '' || assignmentId === '')
      return
    let items = await apiGet(`/api/assignmentStudent`, {
      studentID: studentId,
      assignmentID: assignmentId,
    })
    if (items.length !== 0) {
      await apiDelete(`/api/assignmentStudent/${items[0]._id}`)
    }
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAssignments(userId, companyId) {
  try {
    console.log('student Id', userId)
    console.log('company id', companyId)
    // favorite
    let faAssignments = await apiPost(`/api/assignmentStudent/filter`, {
      studentID: userId,
      companyID: companyId,
    })
    faAssignments =  await Promise.all(faAssignments.map( async (item) => {
      let assignment = await apiGet(`/api/assignment/${item.assignmentID}`)
      let parts = await apiPost(`/api/part/filter`, {
        assignmentID: item.assignmentID,
      })
      assignment.parts = parts
      assignment.state = item.state
      return assignment
    }))
    // rest
    let reAssignments = await apiPost(`/api/assignment/filter`, {companyID: companyId})
    reAssignments = reAssignments.filter((item) => {
      let res = true
      for (let key in faAssignments) {
        if (faAssignments[key]._id === item._id) {
          res = false
          break
        }
      }
      if (!item.activate)
        res = false
      return res
    })
    faAssignments = faAssignments.filter((item) => item.activate)
    reAssignments = reAssignments.filter((item) => item.activate)
    reAssignments = await Promise.all(reAssignments.map( async (item) => {
      let parts = await apiPost(`/api/part/filter`, {
        assignmentID: item._id,
      })
      item.parts = parts
      return item
    }))
    const onAssignments = faAssignments.filter((item) => item.state === 'ongoing')
    const completeAssignments = faAssignments.filter((item) => item.state === 'complete')
    const res = {
      ongoing: onAssignments,
      complete: completeAssignments,
      rest: reAssignments,
    }
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAssignmentState(assignmentId, userId) {
  try {
    // favorite
    let assignments = await apiPost(`/api/assignmentStudent/filter`, {
      studentID: userId,
      assignmentID: assignmentId,
    })
    if (assignments.length === 0)
      return Promise.resolve('rest')
    else {
      return Promise.resolve(assignments[0].state)
    }
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getStudents(assignmentId) {
  try {
    let assignments = await apiPost(`/api/assignmentStudent/filter`, {
      assignmentID: assignmentId,
    })
    const students = await Promise.all(assignments.map(async (item) => {
      let student = await apiGetToken(`/api/user/${item.studentID}`)
      return student
    }))
    return Promise.resolve(students)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAssignmentUsers(assignmentId) {
  try {
    let assignments = await apiPost(`/api/assignmentStudent/filter`, {
      assignmentID: assignmentId,
    })
    const students = await Promise.all(assignments.map(async (item) => {
      let student = await apiGetToken(`/api/user/${item.studentID}`)
      return student
    }))
    let assignment = await apiGet(`/api/assignment/${assignmentId}`)
    let owner = await apiGet(`/api/user/${assignment?.ownerID}`)
    const res = {owner, students}
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}
async function getStudentsOfOwner(ownerId) {
  try {
    let assignments = await apiPost(`/api/assignment/filter`, {
      ownerID: ownerId
    })
    let studentIds = []
    await Promise.all(assignments.map( async (assignment) => {
      let assignmentStudents = await apiPost(`/api/assignmentStudent/filter`, {
        assignmentID: assignment._id,
      })
      let tmp = assignmentStudents.map((item) => item.studentID)
      studentIds = [...studentIds, ...tmp]
    }))
    studentIds = [... new Set(studentIds)]
    let students = await Promise.all(studentIds.map(async (studentId) => {
      let user = await apiGetToken(`/api/user/${studentId}`)
      let assignments = await apiPostToken(`/api/assignmentStudent/filter`, {
        studentID: studentId,
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
      user.assignment = assignment
      const blocks = await apiPost(`/api/studentBlock/filter`, {
        studentID: studentId
      })
      user.blocks = blocks
      return user
    }))
    return Promise.resolve(students)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByPagination(assignmentId, row, from) {
  try {
    let res = []
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getStudentsByLevelId(id) {
  try {
    let students = await apiPost(`/api/assignmentStudent/filter`, {
      levelID: id,
    })
    return Promise.resolve(students)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function setState(assignmentId, studentId, levelState, state) {
  try {
    let assignmentStudents = await apiPost(`/api/assignmentStudent/filter`, {
      assignmentID: assignmentId,
      studentID: studentId,
    })
    if (assignmentStudents.length !== 0) {
      let tmp = {}
      tmp._id = assignmentStudents[0]._id
      tmp.assignmentID = assignmentStudents[0].assignmentID
      tmp.studentID = assignmentStudents[0].studentID
      tmp.levelID = assignmentStudents[0].levelID
      tmp.levelState = levelState
      tmp.state = state
      await apiPut(`/api/assignmentStudent/${tmp._id}`, tmp)
      
      return Promise.resolve({message: 'success'})
    }
    return Promise.resolve(null)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function setLevel(assignmentId, studentId, levelID) {
  try {
    let assignmentStudents = await apiPost(`/api/assignmentStudent/filter`, {
      assignmentID: assignmentId,
      studentID: studentId,
    })
    if (assignmentStudents.length !== 0) {
      let tmp = {}
      tmp._id = assignmentStudents[0]._id
      tmp.levelState = 'ongoing'
      tmp.levelID = levelID
      await apiPut(`/api/assignmentStudent/${tmp._id}`, tmp)
      
      return Promise.resolve({message: 'success'})
    }
    return Promise.resolve(null)
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  addAssignment,
  removeWithStudent,
  getAssignments,
  getAssignmentState,
  getStudentsByLevelId,
  getStudents,
  getAssignmentUsers,
  getStudentsOfOwner,
  getByPagination,
  setState,
  setLevel,
}