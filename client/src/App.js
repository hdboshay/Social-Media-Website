import React from 'react';
import { Layout } from 'antd';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Nav              from './components/nav';
import Home             from './components/home';
import Login            from './components/login';
import Post             from './components/post';
import Account          from './components/account'
import UserContext      from './contexts/user';

const { Header, Content, Footer } = Layout;

class App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = 
    {
      user: {loggedIn : false}
    }
    this.login  = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(user) 
  {
    user.loggedIn = true;
    if(user.Role === "admin") 
    {
       user.isAdmin = true; 
    }
    else
    {
      user.isAdmin = false;
    }
    console.log("Adding user to context (isAdmin = "+user.isAdmin+")")
    this.setState({user:user});
  }
  
  logout() 
  {
    console.log("Removing user from context")
    this.setState({user: {loggedIn:false, isAdmin:false}});
  }
  
  render()
  {
    const context = 
    {
      user:   this.state.user,
      login:  this.login,
      logout: this.logout
    };
    
    return (
      <UserContext.Provider value={context}>
        <Router>
          <Layout className="layout">
            <Header>
              <Nav />
            </Header>            
            <Content>
              <Routes>
                <Route path="/login"    element={<Login />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/"         element={<Home />} />
                <Route path="/account"  element={<Account />} />
              </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Created by Pishy</Footer>
          </Layout>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;

