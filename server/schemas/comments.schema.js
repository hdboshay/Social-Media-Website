module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/comments",
    "title": "Comment",
    "description": "A comment on a post",
    "type": "object",
    "properties": {
      "comment_content": {
        "description": "Body text of the comment",
        "type": "string"
      }
    },
    "required": ["comment_content"],
    "additionalProperties" : false
  }