import { apiDelete, apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/price`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/price/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/price/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/price/${id}`)
    const assignment = await apiGet(`/api/assignment/${res.assignmentID}`)
    res.assignment = assignment
    if (res.type === 'part') {
      const part = await apiGet(`/api/part/${res.sourceID}`)
      res.part = part
    }
    else if (res.type === 'group') {
      let parts = await apiPost(`/api/partGroup/filter`, {
        sourceID: res.id,
      })
      parts = await Promise.all(parts.map( async (item) => {
        const part = await apiGet(`/api/part/${item.partID}`)
        item.part = part
        return item
      }))
      parts.sort((a, b) => {
        let comparison = 0;
        if (a.name > b.name) {
          comparison = 1;
        } else if (a.name < b.name) {
          comparison = -1;
        }
        return comparison;
      })
      res.parts = parts
    }
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/price`)
    res = await Promise.all(res.map( async (price) => {
      const assignment = await apiGet(`/api/assignment/${price.assignmentID}`);
      price.assignment = assignment;
      if (price.type === "part") {
        const part = await apiGet(`/api/part/${price.sourceID}`);
        price.part = part;
      } else if (price.type === "group") {
        let parts = await apiPost(`/api/partGroup/filter`, {
          sourceID: price.id,
        });
        parts = await Promise.all(
          parts.map(async (item) => {
            const part = await apiGet(`/api/part/${item.partID}`);
            item.part = part;
            return item;
          })
        );
        parts.sort((a, b) => {
          let comparison = 0;
          if (a.name > b.name) {
            comparison = 1;
          } else if (a.name < b.name) {
            comparison = -1;
          }
          return comparison;
        });
        price.parts = parts;
      }
      return price
    }))
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/price/filter`, filter)
    res = await Promise.all(res.map( async (price) => {
      const assignment = await apiGet(`/api/assignment/${price.assignmentID}`);
      price.assignment = assignment;
      if (price.type === "part") {
        const part = await apiGet(`/api/part/${price.sourceID}`);
        price.part = part;
      } else if (price.type === "group") {
        let parts = await apiPost(`/api/partGroup/filter`, {
          sourceID: price.id,
        });
        parts = await Promise.all(
          parts.map(async (item) => {
            const part = await apiGet(`/api/part/${item.partID}`);
            item.part = part;
            return item;
          })
        );
        parts.sort((a, b) => {
          let comparison = 0;
          if (a.name > b.name) {
            comparison = 1;
          } else if (a.name < b.name) {
            comparison = -1;
          }
          return comparison;
        });
        price.parts = parts;
      }
      return price
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

const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));

	return arr.filter((_v, index) => results[index]);
}

async function getRestPrices(studentId, assignmentId) {
  try {
    let res = await apiPost(`/api/price/filter`, {
      assignmentID: assignmentId
    })
    res = await asyncFilter(res, async (price) => {
      let tmp = await apiPost(`/api/studentPayment/filter`, {
        priceID: price.id,
        studentID: studentId,
      })
      return tmp.length === 0
    });
    res = await Promise.all(res.map( async (price) => {
      const assignment = await apiGet(`/api/assignment/${price.assignmentID}`);
      price.assignment = assignment;
      if (price.type === "part") {
        const part = await apiGet(`/api/part/${price.sourceID}`);
        price.part = part;
      } else if (price.type === "group") {
        let parts = await apiPost(`/api/partGroup/filter`, {
          sourceID: price.id,
        });
        parts = await Promise.all(
          parts.map(async (item) => {
            const part = await apiGet(`/api/part/${item.partID}`);
            item.part = part;
            return item;
          })
        );
        parts.sort((a, b) => {
          let comparison = 0;
          if (a.name > b.name) {
            comparison = 1;
          } else if (a.name < b.name) {
            comparison = -1;
          }
          return comparison;
        });
        price.parts = parts;
      }
      return price
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
  getByPagination,
  getRestPrices,
}
