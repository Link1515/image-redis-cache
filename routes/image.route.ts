import { Router } from 'express'
import imageController from '../controllers/image.controller'
import {
  imageRequestValidator,
  urlRequireRequestValidator
} from '../requestValidator'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Image
 */

/**
 * @swagger
 *  /image:
 *    get:
 *      description: Convert image format or resize image. *Svg will not be convert!
 *      tags:
 *        - Image
 *      parameters:
 *        - name: url
 *          description: image origin url
 *          in: query
 *          schema:
 *            type: string
 *          required: true
 *          example: https://example.com/image.jpg
 *        - name: ext
 *          description:
 *            File extension which you want to convert.
 *          in: query
 *          schema:
 *            type: string
 *            enum: [avif, webp, jpg, jpeg, png, gif]
 *          default: avif
 *        - name: w
 *          description: resize width
 *          in: query
 *          schema:
 *            type: integer
 *          example: 400
 *        - name: h
 *          description: resize height
 *          in: query
 *          schema:
 *            type: integer
 *          example: 400
 *        - name: fit
 *          description: The way image fit after resized.
 *          in: query
 *          schema:
 *            type: string
 *            enum: [cover, contain]
 *          default: cover
 *      responses:
 *        200:
 *          description: Returns an image buffer.
 *        default:
 *          description: error response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: error message
 *    delete:
 *      description: Clear cache from specific url. You can provide a full path for a single file, like https://example.com/image.jpg. It will clear single image file cache. Or, you can also offer a path to your image directory, like https://example.com/images. It will clear all image cache under the directory.
 *      tags:
 *        - Image
 *      parameters:
 *        - name: url
 *          description: url of image file path or url of image directory
 *          in: query
 *          schema:
 *            type: string
 *          required: true
 *          example: https://example.com/image.jpg
 */

router.get(
  '/',
  urlRequireRequestValidator,
  imageRequestValidator,
  imageController.get
)
router.delete('/', urlRequireRequestValidator, imageController.clearCache)

export default router
