export const serviceEndpointSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "uri": {
      "type": "string"
    },
    "profile": {
      "type": "string"
    },
    "integrity": {
      "type": "string"
    }
  },
  "required": ["uri", "profile"],
  "additionalProperties": false
}
