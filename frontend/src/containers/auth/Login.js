import React, { useEffect, useState } from 'react'

import Header from '../../components/Nav'
import HeaderCompany from '../../components/NavCompany'
import Footer from '../../components/Footer'
import FooterCompany from '../../components/FooterCompany'
import LoginForm from './LoginForm'
import siteConfig from '../../config/site.config'

function Login() {
  const [isCompany, setIsCompany] = useState(false)
  
  useEffect(() => {
    const host = window.location.host;
    const subd = host.split(".")[0];
    if (subd !== siteConfig.domain.split(".")[0] && subd !== 'www') {
      setIsCompany(true)
    }
  }, [])
  return (
    <>
      {/* Header 2 */}
      {!isCompany ? 
        <Header /> :
        <HeaderCompany />
      }
      <LoginForm />
      {/* Footer 2 */}
      {!isCompany ?
        <Footer /> :
        <FooterCompany />
      }
    </>
  )
}

export default Login