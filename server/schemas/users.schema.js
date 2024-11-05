module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/users",
    "title": "User",
    "description": "User details",
    "type": "object",
    "properties": {
      "username": {
        "description": "Username to create",
        "type": "string"
      },
      "password": {
        "description": "Password to create",
        "type": "string"
      },
      "role": {
        "description": "User role",
        "type": "string"
      },
    },
    "required": ["username", "password", "role" ],
    "additionalProperties" : false
  }
