import React from 'react'
import Header from './Header'
import Footer from './Footer'
import "./ContactUs.css";
const ContactUs = () => {
  return (
    <div>
      <Header/>
      <div className="landing_page">
      <div className="responsive-container-block big-container">
        <img className="bg-img" id="iq5bf" src="https://cdn.pixabay.com/photo/2010/12/13/10/05/berries-2277_960_720.jpg" alt="Background" />
        <div className="responsive-container-block container">
          <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12 left-one">
            <div className="content-box">
              <p className="text-blk section-head">
                You can also contact us through
              </p>
              <p className="text-blk section-subhead">
               Phone Number: +1 (123) 456-7890
               <br/>
               <br/>
               Email: info@example.com
               <br/>
               <br/>
               Or directly visit our office at:
               <br/>
               <br/>
               Excelisor Complex, 21 Main Street,Panaji,Goa,Pin-403001 
              </p>
              <div className="icons-container">
                <a className="share-icon">
                  <img className="img" src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-twitter.png" alt="Twitter" />
                </a>
                <a className="share-icon">
                  <img className="img" src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-facebook.png" alt="Facebook" />
                </a>
                <a className="share-icon">
                  <img className="img" src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-google.png" alt="Google" />
                </a>
                <a className="share-icon">
                  <img className="img" src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-instagram.png" alt="Instagram" />
                </a>
              </div>
            </div>
          </div>
          <div className="responsive-cell-block wk-ipadp-6 wk-tab-12 wk-mobile-12 wk-desk-6 right-one" id="i1zj">
            <form className="form-box">
              <div className="container-block form-wrapper">
                <p className="text-blk contactus-head">
                  <a className="link" href=""></a>
                  Get a quote
                </p>
                <p className="text-blk contactus-subhead">
                  We will get back to you in 24 hours
                </p>
                <div className="responsive-container-block">
                  <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-12 wk-ipadp-12" id="i10mt-7">
                    <input className="input" id="ijowk-7" name="FirstName" placeholder="First Name" />
                  </div>
                  <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-12 wk-ipadp-12" id="i1ro7">
                    <input className="input" id="indfi-5" name="Last Name" placeholder="Last Name" />
                  </div>
                  <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-6 wk-ipadp-6 emial" id="ityct">
                    <input className="input" id="ipmgh-7" name="Email" placeholder="Email" />
                  </div>
                  <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                    <input className="input" id="imgis-6" name="PhoneNumber" placeholder="Phone Number" />
                  </div>
                  <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-12 wk-ipadp-12" id="i634i-7">
                    <textarea aria-placeholder="Type message here" className="textinput" id="i5vyy-7" placeholder="Type message here"></textarea>
                  </div>
                </div>
                <button className="submit-btn">
                  Get quote
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
      <Footer/>
    </div>
  )
}

export default ContactUs