import { checkSchema } from 'express-validator'

export const imageRequestValidator = checkSchema(
  {
    url: {
      exists: {
        errorMessage: '`url` is required. Please set the url query string'
      },
      notEmpty: {
        errorMessage: '`url` is required. Please set the url query string'
      },
      custom: {
        errorMessage: `\`url\` can only be in the ${process.env.IMAGE_ALLOWED_DOMAIN} domain`,
        options: (value: string) => {
          const domainRegex = new RegExp(
            `https:\/\/(.*\.)?${process.env.IMAGE_ALLOWED_DOMAIN}.*`
          )
          return domainRegex.test(value)
        }
      }
    },
    ext: {
      optional: true,
      isIn: {
        options: [['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']],
        errorMessage:
          "`ext` can only be one of 'avif', 'webp', 'jpg', 'jpeg', 'png', 'gif'."
      },
      customSanitizer: {
        options: (value: string) => (value === 'jpg' ? 'jpeg' : value)
      }
    },
    fit: {
      default: {
        options: 'cover'
      },
      isIn: {
        options: [['cover', 'contain']],
        errorMessage:
          "`fit` can only be 'cover' or 'contain'. The default value is 'cover'."
      }
    },
    w: {
      optional: true,
      isNumeric: {
        errorMessage: '`w` must be a numeric value'
      },
      toInt: true,
      custom: {
        errorMessage: '`w` must be positive',
        options: (value: number) => value > 0
      }
    },
    h: {
      optional: true,
      isNumeric: {
        errorMessage: '`h` must be a numeric value'
      },
      toInt: true,
      custom: {
        errorMessage: '`h` must be positive',
        options: (value: number) => value > 0
      }
    },
    cacheId: {
      default: {
        options: 'default'
      }
    }
  },
  ['query']
)
