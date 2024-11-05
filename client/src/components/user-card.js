import React from 'react';
import { Card, Button } from 'antd';
import DeleteFilled from '@ant-design/icons/DeleteFilled';
import UserContext from '../contexts/user';
import { status } from '../utilities/requestHandlers';

const { Meta } = Card;
                    
class UserCard extends React.Component
{
    static contextType = UserContext;

    constructor(props)
    {  
        super(props);  
        this.onDeleteUserClicked = this.onDeleteUserClicked.bind(this);
    }

    onDeleteUserClicked()
    {
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
        let hdrs;
        let apiRequest;
        const props     = this.props;

        // delete post
        apiRequest = requestPrefix + this.props.uriDeleteUser;
        hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
        console.log(apiRequest)

        fetch(apiRequest, { method: "DELETE", headers: hdrs })
        .then(status)
        .then( function() { props.deleteUser(); alert(`Account Deleted`); })
        .catch(errorResponse => 
            {
              console.error(errorResponse);
              alert(`Error Deleting Account: ${errorResponse}`);
            });
    }

    render() 
    {
        return (
            <>
            <Card 
                style={{ width: 320 }}
                hoverable={true}
                actions={[
                    <Button   type="default" shape="round" disabled={!this.props.showDeleteButton} onClick={this.onDeleteUserClicked} icon={<DeleteFilled/>} />
                ]}>             
                <Meta title={this.props.Username} description={this.props.Created} />
                {this.props.role}
            </Card>
            </>
        );
    }
}

export default UserCard; 
