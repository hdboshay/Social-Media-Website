import React from 'react';
import { Form, Divider } from 'antd';
import UserContext from '../contexts/user';


class MyAccount extends React.Component 
{
    static contextType = UserContext;
   
    constructor(props) 
    {
        super(props);
    }

    render() 
    {
        const date = new Date(this.context.user.Created);
        const dateTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();

        if( this.context.user.loggedIn )
        {
            return(
                <>
                <Divider orientation="center"><h1>My Account</h1></Divider>
                <Form name="myaccount" labelCol={{span: 10, }}>
                    <Form.Item name="username" label="Username" >
                        {this.context.user.Username}   
                    </Form.Item>
                    <Form.Item name="role" label="Role" >
                        {this.context.user.Role}   
                    </Form.Item>
                    <Form.Item name="created" label="Created" >
                        {dateTime}   
                    </Form.Item>
                </Form>
                </>
            )
        }
    }
}

export default MyAccount;  
