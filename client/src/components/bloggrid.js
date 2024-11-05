import React from 'react';
import { Divider } from 'antd';
import PostCard from './postcard';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';
import PostEntry from './post-entry';

class BlogGrid extends React.Component
{
    static contextType = UserContext;

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            posts: []
        }
        this.fetchPost    = this.fetchPost.bind(this);
        this.fetchPostAll = this.fetchPostAll.bind(this);
        this.deletePost   = this.deletePost.bind(this);
    }

    componentDidMount() 
    {
        this.fetchPostAll();
    }

    fetchPost(postID)
    {
        // postID tells us which post we need to update - but we do the whole grid for now
        this.fetchPostAll();
    }

    deletePost()
    {
        // postID tells us which post we need to update - but we do the whole grid for now
        // If a post has just been deleted, we just refresh the entire list
        this.fetchPostAll();
    }

    fetchPostAll()
    {
        let hdrs;
        let apiRequest;
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
        if( this.context.user.loggedIn )
        {
            apiRequest = requestPrefix + "/posts/private/allPosts" 
            hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
        }
        else
        {
            apiRequest = requestPrefix + "/posts/allPosts" 
            hdrs       = { 'Content-Type': 'application/json'};
        }
        fetch(apiRequest, { method: "GET", headers: hdrs })
        .then(status)
        .then(json)
        .then(data => {
            this.setState({ posts: data })
        })
        .catch(errorResponse => 
        {
            console.error(errorResponse);
            alert(`Error: ${errorResponse}`);
        });    
    }

    render() 
    {
        if (!this.state.posts.length) 
        {
            return <h3>Loading posts...</h3>
        }
        // the next line does the Array.map() operation on the posts
        // to create an array of React elements to be rendered
        const cardList = this.state.posts.map(post => 
        {
            return (
              <div style={{padding:"10px"}} key={post.PostID}>
                    <PostCard {...post} fetchPost={this.fetchPost} deletePost={this.deletePost}/>  
              </div>
            )
        });
      
        return (
            <>
                <PostEntry fetchPostAll={this.fetchPostAll}/>
                <Divider orientation="center"><h1>Posts</h1></Divider>
                {cardList}
            </>
        );
    }
}

export default BlogGrid;
