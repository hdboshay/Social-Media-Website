import React from 'react';
import { Link } from "react-router-dom";
import { Card, Button } from 'antd';
import DeleteFilled from '@ant-design/icons/DeleteFilled';
import PostIcon from './posticon';
import UserContext from '../contexts/user';
import { status } from '../utilities/requestHandlers';

const { Meta } = Card;
                    
class PostCard extends React.Component
{
    static contextType = UserContext;

    constructor(props)
    {  
        super(props);  
        this.onToggleLikeClicked = this.onToggleLikeClicked.bind(this);
        this.onDeletePostClicked = this.onDeletePostClicked.bind(this);
        this.postProcessLikeChanged = this.postProcessLikeChanged.bind(this);
    }

    postProcessLikeChanged(props, postID)
    {
        props.fetchPost(postID);
        if(props.likeListRef.current != null)
        {
          props.likeListRef.current.forceUpdate(props);
        }
    }

    onToggleLikeClicked(liked)
    {
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
        let hdrs;
        let apiRequest;
        const callBack = this.postProcessLikeChanged
        const props = this.props;
        const postID = props.PostID;
        if(liked)
        {
            // delete like
            apiRequest = requestPrefix + this.props.uriDeleteLike;
            hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
            console.log(apiRequest)
            fetch(apiRequest, { method: "DELETE", headers: hdrs })
            .then(status)
            .then( function() { callBack(props, postID); })
            .catch(err => console.log("Error deleting like"));
        }
        else
        {
            // create like
            apiRequest = requestPrefix + this.props.uriCreateLike;
            hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
            console.log(apiRequest)

            fetch(apiRequest, { method: "POST", headers: hdrs })
            .then(status)
            .then(function() { callBack(props, postID); })
            .catch(err => console.log("Error creating like"));
        }
    }

    onDeletePostClicked()
    {
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'
        let hdrs;
        let apiRequest;
        const props = this.props;

        // delete post
        apiRequest = requestPrefix + this.props.uriDeletePost;
        hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
        console.log(apiRequest)
        fetch(apiRequest, { method: "DELETE", headers: hdrs })
        .then(status)
        .then( function() { props.deletePost(); })
        .catch(err => console.log("Error deleting post"));      
    }

    render() 
    {

        const date = new Date(this.props.Created);
        const dateTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    
        return (
            <>
            <Card 
                style={{ width: 320 }}
                cover={<Link to={"/post/"+this.props.PostID}>  <img alt="test" width="320" src={this.props.ImageURL}/> </Link>}
                hoverable={true}
                actions={[
                    <PostIcon type="like"    count={this.props.numLikes}    enabled={this.props.canCreateLike} onClicked={this.onToggleLikeClicked} selected={this.props.liked}/>,
                    <PostIcon type="message" count={this.props.numComments} enabled={false} />,
                    <Button   type="default" shape="round"                  disabled={!this.props.canDeletePost} onClick={this.onDeletePostClicked} icon={<DeleteFilled/>} />
                ]}>             
                <Meta title={this.props.Username} description={dateTime} />
                <p>{this.props.PostContent}</p>
            </Card>
            </>
        );
    }
}

export default PostCard; 
