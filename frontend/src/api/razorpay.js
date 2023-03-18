import { apiPostToken } from './index'

async function createOrder(data) {
  try {
    const result = apiPostToken(`/api/razorpayOrder`, data)

    return Promise.resolve({ data: result })
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  createOrder,
}