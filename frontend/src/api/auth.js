import { apiPost, apiGet } from './index'

async function signin(data) {
  try {
    let res = await apiPost('/api/auth/login', data);
    let { user } = res
    if (user.role !== 'admin') {
      const company = await apiGet(`/api/company/${user?.companyID}`)
      user = { ...user, company: company }
      res = {...res, user}
    }
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function signup(data) {
  try {
    const res = await apiPost("/api/auth/register", data);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function forgetPassword(data) {
  try {
    const res = await apiPost("/api/auth/forgetPassword", data);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function check(data) {
  try {
    const res = await apiPost("/api/auth/check", data);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function verifyEmail(data) {
  try {
    const res = await apiPost("/api/auth/verifyEmail", data);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function changePassword(data) {
  try {
    const res = await apiPost("/api/auth/changePassword", data);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function resetPassword(data) {
  try {
    const res = await apiPost("/api/auth/resetPassword", data);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

export { signup, signin, forgetPassword, check, changePassword, resetPassword, verifyEmail };
