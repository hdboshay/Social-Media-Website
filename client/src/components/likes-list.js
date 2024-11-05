import React from 'react';
import { Card } from 'antd';
import LikeCard from './like-card';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';

const { Meta } = Card;

class LikesList extends React.Component
{
    static contextType = UserContext;
     
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            loading: true,
            likes: []
        }
        this.fetchLikesAll = this.fetchLikesAll.bind(this);
        this.deleteLike    = this.deleteLike.bind(this);
    }

    forceUpdate(props)
    {
        this.fetchLikesAll(props)
    }

    componentDidMount() 
    {
        this.fetchLikesAll(this.props);
    }

    deleteLike(postProps)
    {
        // postID tells us which post we need to update 
        // If a comment has just been deleted
        this.fetchLikesAll(postProps);
    }

    fetchLikesAll(postProps)
    {
        this.setState({ loading: true, likes: [] })
        let hdrs;
        let apiRequest;
        const requestPrefix = 'https://justiceharlem-ciphermember-5000.codio-box.uk/api/v1'

        if( this.context.user.loggedIn )
        {
            apiRequest = requestPrefix + postProps.uriGetLikesAuth
            hdrs       = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.context.user.jwt}`};
        }
        else
        {
            apiRequest = requestPrefix + postProps.uriGetLikes;
            hdrs       = { 'Content-Type': 'application/json'};
        }
        console.log(apiRequest)
        fetch(apiRequest, { method: "GET", headers: hdrs })
        .then(status)
        .then(json)
        .then(data => {
            this.setState({ loading: false, likes: data })
            postProps.fetchPost(postProps.PostID);
        })
        .catch(err => {console.log("Error fetching likes"); 
                       this.setState({ loading: false, likes: [] })});
    }

    likes() 
    {
        if( !this.state.likes.length )
        {
            return (<>
            <Card >
                <Meta title="No likes for this post" />
            </Card></>
            );
        }
        else
        {
            const postProps = this.props
            const cardList = this.state.likes.map(like => 
            {
                return (<>
                <div style={{padding:"10px"}} key={like.like_id}>
                    <LikeCard {...like} postProps={postProps} fetchLike={this.fetchLikesAll} deleteLike={this.deleteLike}/>  
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
            return <h3>Loading likes...</h3>
        }
        // the next line does the Array.map() operation on the posts
        // to create an array of React elements to be rendered
        return (
            <>
                    {this.likes()}
            </>
        );
    }
}

export default LikesList;
