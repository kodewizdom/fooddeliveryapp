import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import './AboutUs.css';

const AboutUs = () => {
    return (<div className="responsive-container-block bigContainer">
        <Header/>
  <div className="responsive-container-block Container">
    <img className="mainImg" src="https://img.freepik.com/premium-vector/safe-food-delivery_23-2148547689.jpg?size=626&ext=jpg&ga=GA1.2.1942277562.1684654512&semt=ais" alt="Main Image" />
    <div className="allText aboveText">
      <p className="text-blk headingText">
        Our Mission
      </p>
      <p className="text-blk subHeadingText">
        Delivering Delightful Dining Experiences
      </p>
      <p className="text-blk description">
      Our mission is to provide a seamless and enjoyable dining experience by delivering delicious and nutritious meals right to your doorstep.  We are committed to supporting local businesses, promoting sustainability, and ensuring that everyone can enjoy restaurant-quality meals from the comfort of their own homes. Join us on our mission to redefine the way we experience food and make every meal a memorable one.
      </p>
      <button className="explore">
        Explore
      </button>
    </div>
  </div>
  <div className="responsive-container-block Container bottomContainer">
    <img className="mainImg" src="https://plus.unsplash.com/premium_photo-1682310127688-d3d3aa40508a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHxncm93dGglMjBhcnJvd3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60" alt="Main Image" />
    <div className="allText bottomText">
      <p className="text-blk headingText">
        Our Vision
      </p>
      <p className="text-blk subHeadingText">
      Transforming the Way You Experience Food
      </p>
      <p className="text-blk description">
      At our core, our vision is to revolutionize the way you experience food. We believe in creating memorable dining moments by delivering exceptional culinary delights, exploring diverse flavors, and embracing innovative techniques. With a commitment to quality, creativity, and sustainability, we strive to exceed your expectations and make every meal a remarkable journey for your taste buds. Our vision is to inspire and delight, fostering a deep appreciation for food and its ability to bring people together.
      </p>
      <button className="explore">
        Explore
      </button>
    </div>
  </div>
  <Footer/>
</div>

    );
  };

  
  
  export default AboutUs;