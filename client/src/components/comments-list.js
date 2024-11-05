import React from 'react';
import { Card } from 'antd';
import CommentCard from './comment-card';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';
import CommentEntry from './comment-entry';

const { Meta } = Card;

class CommentsList extends React.Component
{
    static contextType = UserContext;

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            loading: true,
            comments: []
        }
        this.fetchCommentAll = this.fetchCommentAll.bind(this);
        this.deleteComment   = this.deleteComment.bind(this);
    }

    componentDidMount() 
    {
        this.fetchCommentAll(this.props);
    }

    deleteComment(postProps)
    {
        // postID tells us which post we need to update 
        // If a comment has just been deleted
        this.fetchCommentAll(postProps);
    }

    fetchCommentAll(postProps)
    {
        this.setState({ loading: true, comments: [] })
        let hdrs;
        let apiRequest;
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'

        if( this.context.user.loggedIn )
        {
            apiRequest = requestPrefix + postProps.uriGetCommentsAuth
            hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
        }
        else
        {
            apiRequest = requestPrefix + postProps.uriGetComments;
            hdrs       = { 'Content-Type': 'application/json'};
        }
        console.log(apiRequest)

        fetch(apiRequest, { method: "GET", headers: hdrs })
        .then(status)
        .then(json)
        .then(data => {
            this.setState({ loading: false, comments: data })
            postProps.fetchPost(postProps.PostID);
        })
        .catch(err => {console.log("Error fetching comments"); 
                      this.setState({ loading: false, comments: [] })});
    }

    comments() 
    {
        if( !this.state.comments.length )
        {
            return (<>
            <Card >
                <Meta title="No comments for this post" />
            </Card></>
            );
        }
        else
        {
            const postProps = this.props
            const cardList = this.state.comments.map(comment => 
            {
                return (<>
                <div style={{padding:"10px"}} key={comment.comment_id}>
                    <CommentCard {...comment} postProps={postProps} fetchComment={this.fetchCommentAll} deleteComment={this.deleteComment}/>  
                </div></>
                )
            });
            return (cardList)
        }
    }

    render() 
    {
        if (this.state.loading) 
        {
            return <h3>Loading comments...</h3>
        }
        // the next line does the Array.map() operation on the posts
        // to create an array of React elements to be rendered
        const postProps = this.props;
        return (
            <>
                    <CommentEntry {...postProps} fetchComment={this.fetchCommentAll} />
                    {this.comments()}
            </>
        );
    }
}

export default CommentsList;
