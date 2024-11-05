import React from 'react';

import LikeOutlined from '@ant-design/icons/LikeOutlined';
import LikeFilled from '@ant-design/icons/LikeFilled';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import MessageFilled from '@ant-design/icons/MessageFilled';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import DeleteFilled from '@ant-design/icons/DeleteFilled';

function getIcon (theme, iconType) {
    let Icon;
  
    if (theme === 'filled') {
      if (iconType === 'like') {
        Icon = LikeFilled
      } else if (iconType === 'delete') {
        Icon = DeleteFilled
      } else if (iconType === 'message') {
        Icon = MessageFilled
    }
  } else if (theme === 'outlined') {
    if (iconType === 'like') {
      Icon = LikeOutlined
    } else if (iconType === 'delete') {
      Icon = DeleteOutlined
    } else if (iconType === 'message') {
      Icon = MessageOutlined
    }      
  }

  return Icon;
}

class PostIcon extends React.Component 
{
    constructor(props)
    {  
        super(props);  
        this.onClick = this.onClick.bind(this);
    }

    render()
    {
        const theme = this.props.selected ? 'filled' : 'outlined';
        const iconType = this.props.type;
        const Icon = getIcon(theme, iconType);
    
        return (
          <span style={this.props.enabled ? {color:'steelblue'} : {color:'lightgrey'}}>
            <Icon onClick={this.onClick} style={this.props.enabled ? {color:'steelblue'} : {color:'lightgrey'}} />
            {this.props.count}
          </span>
        );
    }
    onClick()
    {
      if(this.props.enabled)
      {
        if(this.props.onClicked !== undefined )
          {
            this.props.onClicked(this.props.selected)
          }
        }
    }
}
export default PostIcon;
