export const profileSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "metadata": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "The decentralized identifier representing the profile in the DID format."
        },
        "type": {
          "type": "string",
          "description": "A string indicating the type of the profile."
        },
        "checksum": {
          "type": "string",
          "description": "A checksum value for data integrity validation."
        },
        "created": {
          "type": "string",
          "description": "Timestamp indicating profile creation date."
        },
        "name": {
          "type": "string",
          "description": "A human-readable name for the profile."
        },
        "previous": {
          "type": "string",
          "description": "Reference to a previous version of the profile data."
        },
        "description": {
          "type": "string",
          "description": "A detailed description of the profile."
        },
        "short_description": {
          "type": "string",
          "description": "A concise description of the profile."
        },
        "docs_url": {
          "type": "string",
          "description": "URL to documentation for the profile data."
        },
        "version": {
          "type": "string",
          "description": "The version of the profile data, following semver."
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Tags associated with the profile data."
        }
      },
      "required": ["id"],
      "additionalProperties": true
    },
    "definitions": {
      "type": "object",
      "description": "Defines capabilities or services related to the profile data."
    },
    "proof": {
      "type": "object",
      "description": "Information related to proofing the authenticity of the profile data."
    }
  },

  "required": ["metadata"],
  "additionalProperties": false
}
