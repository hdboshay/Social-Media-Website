import React from 'react';
import { Form, Input, Button, Select, Divider } from 'antd';
import UserContext from '../contexts/user';
import { status } from '../utilities/requestHandlers';

/**
 * Registration form component for app signup.
 */
class Signup extends React.Component 
{
    static contextType = UserContext;
    /**
        Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? 
        ^.*              : Start
        (?=.{8,})        : Length
        (?=.*[a-zA-Z])   : Letters
        (?=.*\d)         : Digits
        (?=.*[!#$%&? "]) : Special characters
        .*$              : End
    */
    //passwordRegex = '^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$'
    passwordRegex = ""
    usernameRegex = ""

    constructor(props) 
    {
        super(props);
        this.createAccount = this.createAccount.bind(this);
        this.formRef  = React.createRef();
    }

    createAccount(values)
    {
        let apiRequest;
        let hdrs;
        let bdy;
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
        const props = this.props;
        // create account
        if(  this.context.user.loggedIn && values.role === "admin" )
        {
            apiRequest = requestPrefix + "/users/create/admin";
            hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
            bdy        = JSON.stringify({ "username": values.username, "password":values.password, "role":values.role });
        }
        else
        {
            // not logged in, so can only request user account creation, and don't need to authenticate
            apiRequest = requestPrefix + "/users/create/user";
            hdrs       = { 'Content-Type': 'application/json',};
            bdy        = JSON.stringify({ "username": values.username, "password":values.password, "role":values.role });
        }
        fetch(apiRequest, { method: "POST", body: bdy , headers: hdrs})
        .then(status)
        .then( function() { props.accountListUpdated(); alert(`Account Created`);  })
        .catch(errorResponse => 
            {
              console.error(errorResponse);
              alert(`Error Creating Account: ${errorResponse}`);
            });  
        this.formRef.current.resetFields();
        this.forceUpdate()
    }

    render() 
    {
        let canCreateAdmin = false;
        if(( this.context.user.loggedIn ) && ( this.context.user.isAdmin ))
        {
            canCreateAdmin = true;
        }
        else
        {
            canCreateAdmin = false;
        }
        return (
            <>
            <Divider orientation="center"><h1>Create Account</h1></Divider>
            <Form name="register" ref={this.formRef} onFinish={this.createAccount} labelCol={{span: 10, }} autoComplete="off"
            initialValues={{ usernam: "", password: "", confirm:"", role:"user" }}>
                <Form.Item name="username" label="Username" rules={[ { required: true, pattern: this.usernameRegex},]}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[ { required: true, pattern: this.passwordRegex },]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} 
                        rules={[{ required: true, pattern: this.passwordRegex, },
                            ({ getFieldValue }) => (
                                {
                                    validator(_, value) 
                                    {
                                        if (!value || getFieldValue('password') === value) 
                                        {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The new password that you entered do not match!'));
                                    },
                                }),
                        ]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="role" label="Account Type">
                    <Select style={{ width: 120, }}
                            options={[ { value: 'user', label: 'User' }, { value: 'admin', label: 'Admin', disabled: !canCreateAdmin} ]}
                            />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
            </>
        );
    };
};

export default Signup;  
