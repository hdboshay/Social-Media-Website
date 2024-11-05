import React from 'react';
import { Row } from 'antd';
import UserContext from '../contexts/user';
import Signup from './signup'
import MyAccount from './myaccount';
import UsersList from './users-list';

class Account extends React.Component
{
    static contextType = UserContext;

    state = {redirect: null}

    constructor(props) 
    {
        super(props);
    }

    accountListUpdated()
    {

    }

    render()
    {
        return (
            <>
                <div className="site-layout-content">
                <div>
                    <Row justify="center">
                        <center>
                            <Row justify="center">
                                <center>
                                    <Signup accountListUpdated={this.accountListUpdated}/>
                                    <MyAccount/>
                                    <UsersList/>
                                </center>
                            </Row>
                        </center>
                    </Row>
                </div>
            </div>
            </>
        );  
    }
}

export default Account;