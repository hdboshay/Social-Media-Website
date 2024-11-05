import React from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Row } from 'antd';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';
import PostCard from './postcard';
import { Navigate } from 'react-router-dom';
import CommentsList from './comments-list';
import LikesList from './likes-list';

class Post extends React.Component
{
  static contextType = UserContext;

  state = {redirect: null}

  constructor(props) 
  {
      super(props);
      this.state = 
      {
          post: null
      }
      this.fetchPost  = this.fetchPost.bind(this);
      this.deletePost = this.deletePost.bind(this);
      this.likesListRef = React.createRef();
  }

  componentDidMount() 
  {
    const id = this.props.params.id;
    this.fetchPost(id);
  }

  fetchPost(id)
  {
    let hdrs;
    let apiRequest;
    const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
    if( this.context.user.loggedIn )
    {
        apiRequest = requestPrefix + "/posts/private/" + id;
        hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
    }
    else
    {
        apiRequest = requestPrefix + "/posts/" + id;
        hdrs       = { 'Content-Type': 'application/json'};
    }
    fetch(apiRequest, { method: "GET", headers: hdrs })
    .then(status)
    .then(json)
    .then(data => {
        this.setState({ post: data })
    })
    .catch(err => console.log("Error fetching post"));
  }

  deletePost()
  {
    this.setState({redirect:'/'});
  }

  render()
  {
    if (this.state.redirect) 
    {
      return <Navigate to={this.state.redirect} />
    }    
    else
    {
      if(this.state.post === null )
      {
        return <>...Loading data</>
      }
      else
      {
        const post = this.state.post;
        return (
          <>
            <Row justify="center">
              <center>
                <Divider orientation="center"><h1>Post</h1></Divider>
                <PostCard {...post} fetchPost={this.fetchPost} deletePost={this.deletePost} likeListRef={this.likesListRef}/>  
                <Divider orientation="center"><h1>Comments</h1></Divider>
                <CommentsList {...post} fetchPost={this.fetchPost}/>
                <Divider orientation="center"><h1>Likes</h1></Divider>
                <LikesList ref={this.likesListRef} {...post} fetchPost={this.fetchPost}/>
              </center>
            </Row>
          </>
        );
      }
    }
  }
}

export default (props) => (<Post {...props} params={useParams()}/>); 
