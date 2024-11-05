import React from 'react';
import { Form, Input, Button, Divider } from 'antd';
import UserContext from '../contexts/user';
import { status } from '../utilities/requestHandlers';

class PostEntry extends React.Component 
{
    static contextType = UserContext;

    constructor(props)
    {  
        super(props);  
        this.postPost = this.postPost.bind(this);
        this.formRef  = React.createRef();
    }

    postPost(values)
    {
        if( values.postText.length !== 0 )
        {
            const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
            const props = this.props;
    
            // create post
            const apiRequest = requestPrefix + "/posts/private/"+this.context.user.UserID;
            const hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
            const bdy        = JSON.stringify({ "post_content": values.postText, "image_url": values.imgURL});
            fetch(apiRequest, { method: "POST", body: bdy , headers: hdrs})
            .then(status)
            .then( function() { props.fetchPostAll(); alert(`Post Created`); })
            .catch(errorResponse => 
                {
                  console.error(errorResponse);
                  alert(`Error Creating Post: ${errorResponse}`);
                });
        }
        else
        {
            console.log("Ignoring empty post comment")
        }        
        this.formRef.current.resetFields();
        this.forceUpdate()
    };

    getRandomImageUrl()
    {
        const imageNumber = Math.floor(Math.random()*1000);
        const imgURL = "https://picsum.photos/id/"+imageNumber+"/200/300"
        return imgURL
    }

    render() 
    {
        let imgURL;
        if(this.context.user.loggedIn)
        {
            if(this.formRef.current != null)
            {
                imgURL = this.formRef.current.getFieldValue(['imgURL'])
            }
            else
            {
                imgURL = ""
            }
            return (
                <>
                    <Divider orientation="center"><h1>New Post</h1></Divider>
                    <Form   ref={this.formRef}
                    name="postform" initialValues={{ imgURL: this.getRandomImageUrl(), postText: "" }}
                    onFinish={this.postPost}
                    autoComplete="off"
                    >
                        <img alt="postimg" width="320" src={imgURL}/>
                        <Form.Item name="imgURL"   label="ImageURL" >
                            {imgURL}   
                        </Form.Item>
                        <Form.Item name="postText" label="Post" rules={[ { required: true, message: 'What are you feeling?', },]}>
                            <Input />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" htmlType="submit">Post</Button>
                        </Form.Item>
                        <Form.Item >
                            <Button onClick={e => {
                                                 this.formRef.current.resetFields();
                                                 this.forceUpdate()
                                            }} >Change Picture</Button>
                        </Form.Item>
                    </Form>
                </>
            );
        }
        else
        {
            return ( 
                <>
                    <h2>Login to create a post</h2>
                </>
                );
        }
    };  
};
export default PostEntry;  
