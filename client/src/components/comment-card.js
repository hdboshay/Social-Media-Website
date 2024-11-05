import React from 'react';
import { Card, Button } from 'antd';
import DeleteFilled from '@ant-design/icons/DeleteFilled';
import UserContext from '../contexts/user';
import { status } from '../utilities/requestHandlers';

const { Meta } = Card;
                    
class CommentsCard extends React.Component
{
    static contextType = UserContext;

    constructor(props)
    {  
        super(props);  
        this.onDeleteCommentClicked = this.onDeleteCommentClicked.bind(this);
    }

    onDeleteCommentClicked()
    {
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
        let hdrs;
        let apiRequest;
        const props     = this.props;
        const postProps = this.props.postProps;

        // delete post
        apiRequest = requestPrefix + this.props.uriDeleteComment;
        hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
        console.log(apiRequest)
        fetch(apiRequest, { method: "DELETE", headers: hdrs })
        .then(status)
        .then( function() { props.deleteComment(postProps); })
        .catch(errorResponse => 
        {
            console.error(errorResponse);
            alert(`Error Deleting Comment: ${errorResponse}`);
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
                    <Button   type="default" shape="round" disabled={!this.props.showDeleteButton} onClick={this.onDeleteCommentClicked} icon={<DeleteFilled/>} />
                ]}>             
                <Meta title={this.props.username} description={this.props.comment_content} />
            </Card>
            </>
        );
    }
}

export default CommentsCard; 
