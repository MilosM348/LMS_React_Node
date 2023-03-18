import React, {useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import {useSetting} from '../../provider/setting'
import {setCookie} from '../../service/cookie'

const Logout = () => {
  const [, dispatch] = useSetting()
  const history = useHistory()

  useEffect(() => {
    console.log('logout')
    dispatch({type: 'SET', settingName: 'auth', settingData: null})
    setCookie('auth', '', 0)
    setCookie('token', '', 0)
    history.push('/login')
  }, [])
  return (
    <div></div>
  )
}
export default Logout
