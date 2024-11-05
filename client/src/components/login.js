import React from 'react';
import { Form, Input, Button } from 'antd';
import UserContext from '../contexts/user';
import { Navigate } from 'react-router-dom';
import { status, json } from '../utilities/requestHandlers';


class Login extends React.Component 
{
    static contextType = UserContext;

    constructor(props)
    {  
        super(props);  
        this.login = this.login.bind(this);
    }

    state = {redirect: null}

    login(values)
    {
      // Called when Login button pressed and a username and password were entered correctly
      //const basicAuth     = encode(`${values.username}:${values.password}`)
      const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
      const apiRequest    = requestPrefix + "/users/getjwt/" + values.username
      fetch(apiRequest, 
        { 
          method: "GET", headers: { 'Content-Type': 'application/json', 'Authorization': "Basic "+btoa(values.username + ":" +values.password)}
        })
      .then(status)
      .then(json)
      .then(data => 
        {
          // store the user in localStorage
          let user = { "UserID": data.UserID, "Username": values.username, "Role": data.Role, "jwt": data.jwt, "Created": data.Created }
          this.context.login(user);
          this.setState({redirect:'/'});
        })
      .catch(errorResponse => 
        {
          console.error(errorResponse);
          this.context.logout();
          alert(`Error Logging In: ${errorResponse}`);
        });  
    };

    render() 
    {
        if (this.state.redirect) 
        {
          return <Navigate to={this.state.redirect} />
        }    
        else
        {
          return (
                <Form name="login" labelCol={{span: 8, }} wrapperCol={{span: 16, }} style={{ maxWidth: 600, }} initialValues={{remember: true, }}
                onFinish={this.login}
                autoComplete="off"
                >
                    <h1>Login</h1>
                    <p>
                      You can register for an account via the <a href ="/account">Account</a> page
                    </p>
                    <Form.Item name="username" label="Username" rules={[ { required: true, message: 'Please input your username!', },]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[ { required: true, message: 'Please input your password!', },]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                        <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                </Form>
            );
        }
    };  
};

export default Login;  
