module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/posts",
    "title": "Post",
    "description": "A post on the feed",
    "type": "object",
    "properties": 
    {
      "post_content": 
      {
        "description": "Body text of the post",
        "type": "string"
      },
      "image_url": 
      {
        "description": "URL to the image",
        "type": "string"
      }
    },
    "required": ["post_content","image_url"],
    "additionalProperties": false
  }
