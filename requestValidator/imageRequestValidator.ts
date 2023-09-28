import { checkSchema } from 'express-validator'

export const imageRequestValidator = checkSchema(
  {
    ext: {
      default: {
        options: 'avif'
      },
      isIn: {
        options: [['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']],
        errorMessage:
          "ext can only be one of 'avif', 'webp', 'jpg', 'jpeg', 'png', 'gif'. Default is 'avif'."
      }
    },
    fit: {
      default: {
        options: 'cover'
      },
      isIn: {
        options: [['cover', 'contain']],
        errorMessage:
          "fit can only be 'cover' or 'contain'. Default is 'cover'."
      }
    },
    w: {
      optional: true,
      isNumeric: {
        errorMessage: 'w must be Numeric'
      },
      toInt: true
    },
    h: {
      optional: true,
      isNumeric: {
        errorMessage: 'w must be Numeric'
      },
      toInt: true
    }
  },
  ['query']
)
