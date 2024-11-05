import React from 'react';
import { Divider, Card } from 'antd';
import UserCard from './user-card';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';

const { Meta } = Card;

class UsersList extends React.Component
{
    static contextType = UserContext;

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            loading: true,
            users: []
        }
        this.fetchUsersAll = this.fetchUsersAll.bind(this);
        this.deleteUser    = this.deleteUser.bind(this);
    }

    componentDidMount() 
    {
        this.fetchUsersAll();
    }

    deleteUser()
    {
        this.fetchUsersAll();
    }

    fetchUsersAll()
    {
        this.setState({ loading: true, users: [] })
        let hdrs;
        let apiRequest;
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'

        apiRequest = requestPrefix + "/users"
        hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
        console.log(apiRequest)

        fetch(apiRequest, { method: "GET", headers: hdrs })
        .then(status)
        .then(json)
        .then(data => {
            this.setState({ loading: false, users: data })
        })
        .catch(err => {console.log("Error fetching users"); 
                      this.setState({ loading: false, users: [] })});
    }

    users() 
    {
        if( !this.state.users.length )
        {
            return (<>
            <Card >
                <Meta title="No Users" />
            </Card></>
            );
        }
        else
        {
            const userList = this.state.users.map(user => 
            {
                return (<>
                <div style={{padding:"10px"}} key={user.UserID}>
                    <UserCard {...user} deleteUser={this.deleteUser}/>  
                </div></>
                )
            });
            return (userList)
        }
    }

    render() 
    {
        // the next line does the Array.map() operation on the posts
        // to create an array of React elements to be rendered
        if(( this.context.user.loggedIn ) && ( this.context.user.isAdmin ))
        {
            if (this.state.loading) 
            {
                return <h3>Loading users...</h3>
            }
            else
            {
                return (
                <>
                    <Divider orientation="center"><h1>Other Accounts</h1></Divider>
                    {this.users()}
                </>
                );
            }
        }
    }
}

export default UsersList;
