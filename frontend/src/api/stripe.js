import { apiPostToken } from './index'

async function paymentIntent(data) {
  try {
    const result = await apiPostToken(`/api/payment/stripeIntent`, data)
    
    return Promise.resolve({data: result})
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  paymentIntent,
}