import { apiDelete, apiGet, apiPost, apiPut } from "./index";

async function create(data) {
  try {
    await apiPost(`/api/exam`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(data) {
  try {
    await apiPut(`/api/exam/${data._id}`, data);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function remove(id) {
  try {
    await apiDelete(`/api/exam/${id}`);
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function attach(priceId, codes, isFree, discount) {
  try {
    await Promise.all(
      codes.map(async (code) => {
        await apiPost(`/api/exam`, {
          priceID: priceId,
          code: code,
          isFree: isFree,
          discountPercentage: discount,
        });
      })
    );
    return Promise.resolve({ message: "success" });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function get(id) {
  try {
    let res = await apiGet(`/api/exam/${id}`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    let res = await apiGet(`/api/exam`);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getFilter(filter) {
  try {
    let res = await apiPost(`/api/exam/filter`, filter);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getFirstRow(levelId, row) {
  try {
    let res = []
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByPagination(levelId, row, from) {
  try {
    let res = []
    
    return Promise.resolve(res)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function getByLevelId(id) {
  try {
    let res = apiPost(`/api/exam/filter`, {
      levelID: id
    })
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
  getFilter,
  getAll,
  getFirstRow,
  getByPagination,
  getByLevelId,
}
