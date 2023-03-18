import { apiDelete, apiGet, apiGetToken, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/notification`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/notification/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/notification/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let notification = await apiGet(`/api/notification/${id}`)
    const student = await apiGetToken(`/api/user/${notification.studentID}`)
    notification.student = student
    const assignment = await apiGet(`/api/assignment/${notification.assignmentID}`)
    notification.assignment = assignment
    const level = await apiGet(`/api/level/${notification.levelID}`)
    notification.level = level
    return Promise.resolve(notification)
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
    let notifications = await apiGet(`/api/notification`)
    notifications =  await Promise.all(notifications.map( async (notification) => {
      const student = await apiGetToken(`/api/user/${notification.studentID}`);
      notification.student = student;
      const assignment = await apiGet(
        `/api/assignment/${notification.assignmentID}`
      );
      notification.assignment = assignment;
      const level = await apiGet(`/api/level/${notification.levelID}`);
      notification.level = level;
      const part = await apiGet(`/api/part/${notification?.level?.partID}`);
      notification.part = part;
      let parts = await apiPost(`/api/part/filter`, {
        assignmentID: notification.assignmentID
      })
      parts = await Promise.all(parts.map(async (part) => {
        let levels = await apiPost(`/api/level/filter`, {
          partID: part._id
        })
        part.levels = levels
        return part
      }))
      notification.parts = parts
      return notification
    }))
    return Promise.resolve(notifications)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let notifications = await apiPost(`/api/notification/filter`, filter)
    notifications =  await Promise.all(notifications.map( async (notification) => {
      const student = await apiGetToken(`/api/user/${notification.studentID}`);
      notification.student = student;
      const assignment = await apiGet(
        `/api/assignment/${notification.assignmentID}`
      );
      notification.assignment = assignment;
      const level = await apiGet(`/api/level/${notification.levelID}`);
      notification.level = level;
      const part = await apiGet(`/api/part/${notification?.level?.partID}`);
      notification.part = part;
      let parts = await apiPost(`/api/part/filter`, {
        assignmentID: notification.assignmentID
      })
      parts = await Promise.all(parts.map(async (part) => {
        let levels = await apiPost(`/api/level/filter`, {
          partID: part._id
        })
        part.levels = levels
        return part
      }))
      notification.parts = parts
      return notification
    }))
    return Promise.resolve(notifications)
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