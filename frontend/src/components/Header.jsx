import React from 'react'

function Header(props) {
  return (
    <div>
      <nav className="navbar">
        <div className="leftIcon">
          <img className="logo" src="/logo.png" alt="Logo" />
        </div>
        <div className="rightIcon">
          <a href="/user">SignIn/SignUp</a>
        </div>
      </nav>
      <div className='text-center'>
        <h1>PicFable</h1>
      </div>
    </div>
  );
};

export default Header;
// 