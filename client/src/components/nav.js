import React from 'react';
import { useContext } from 'react';
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import UserContext from '../contexts/user';

function Nav(props) 
{
  const context = useContext(UserContext);
  const loggedIn = context.user.loggedIn;

  let LoginNav;
  if( !loggedIn )
  {
    LoginNav = 
    (
      <>
        <Menu.Item key="2"><Link to="/login"/>Login</Menu.Item>        
      </>
    )
  }
  else
  {
    LoginNav = 
    (
      <>
        <Menu.Item key="2" onClick={context.logout}><Link to="/"/>Logout</Menu.Item>        
      </>
    )
  }

  return (
      <>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1"><Link to="/"/>Home</Menu.Item>
          {LoginNav}
          <Menu.Item key="3"><Link to="/account"/>Account</Menu.Item>        
        </Menu>       
      </>
  );
}

export default Nav;