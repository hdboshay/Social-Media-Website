import React from 'react';
import { Form, Input, Button } from 'antd';
import UserContext from '../contexts/user';
import { status } from '../utilities/requestHandlers';

class CommentEntry extends React.Component 
{
    static contextType = UserContext;

    constructor(props)
    {  
        super(props);  
        this.postComment = this.postComment.bind(this);
    }

    postComment(values)
    {
        if( values.commentText.length !== 0 )
        {
            const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
            const props = this.props;
    
            // create comment
            //const body = JSON{"comment_content" : values.commentText }
            const apiRequest = requestPrefix + this.props.uriCreateComment;
            const hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
            const bdy        = JSON.stringify({ "comment_content": values.commentText});
            fetch(apiRequest, { method: "POST", body: bdy , headers: hdrs})
            .then(status)
            .then( function() { props.fetchComment(props);})
            .catch(errorResponse => 
                {
                  console.error(errorResponse);
                  alert(`Error Creating Comment: ${errorResponse}`);
                });        
        }
        else
        {
            console.log("Ignoring empty comment")
        }
    };

    render() 
    {

        if(this.props.canCreateComment )
        {
            return (
                <Form name="comment" layout="vertical" initialValues={{remember: true, }}
                onFinish={this.postComment}
                autoComplete="off"
                >
                    <Form.Item name="commentText" label="Add a comment" rules={[ { required: true, message: 'What are you feeling?', },]}>
                        <Input />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">Post</Button>
                    </Form.Item>
                </Form>
            );
        }
        else
        {
            return ( 
                <>
                    <h2>Login to post a comment</h2>
                </>
                );
        }
    };  
};

export default CommentEntry;  
