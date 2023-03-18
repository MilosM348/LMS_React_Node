import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import NavCompany from '../components/NavCompany'
// import CourseFilter from '../components/CourseFilter'
import Content from '../components/Content'
import Features from '../components/Features'
import TestimonialSlider from '../components/TestimonialSlider'
import FaqEvent from '../components/FaqEvent'
import HomeBlog from '../components/HomeBlog'
import NewsletterForm from '../components/NewsletterForm'
import Footer from '../components/Footer'
import FooterCompany from '../components/FooterCompany'
import siteConfig from '../config/site.config'
import LoginForm from './auth/LoginForm'

const Home = () => {
    const [subdomain, setSubdomain] = useState('')

    useEffect(() => {
        const host = window.location.host;
        const subd = host.split(".")[0];
        if (subd !== siteConfig.domain.split(".")[0] && subd !== 'www') {
            setSubdomain(subd)
        }
    },[])
    return (
        <div className="main-wrapper" >

            {subdomain === '' ? 
                (
                    <>
                        {/* Nav */}
                        < Nav />
                        <Content />
            
                        <Features />
                        {/* Course Filter */}
                        {/* < CourseFilter /> */}
            
                        {/* Testimonial Slider */}
                        < TestimonialSlider />
            
                        {/* Faq & Event Area */}
                        < FaqEvent />
            
                        {/* Blog Area */}
                        < HomeBlog />
            
                        {/* Newsletter Form */}
                        {/* < NewsletterForm /> */}
                        {/* Footer */}
                        < Footer />
                    </>
                ) : (
                    <>
                        <NavCompany />
                        <LoginForm />
                        <FooterCompany />
                    </>
                )
            }


        </div >
    )
}

export default Home
