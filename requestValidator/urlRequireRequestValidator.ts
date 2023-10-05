import { checkSchema } from 'express-validator'

export const urlRequireRequestValidator = checkSchema(
  {
    url: {
      exists: {
        errorMessage:
          "url is required, i.e., query string must have 'url' parameter"
      },
      notEmpty: {
        errorMessage: 'url is required, but get an empty string'
      },
      custom: {
        errorMessage: 'url can only be in the udn domain',
        options: value => {
          const udnDomainRegex = /https:\/\/(.*\.)?udn\.com.*/
          return udnDomainRegex.test(value)
        }
      }
    }
  },
  ['query']
)
