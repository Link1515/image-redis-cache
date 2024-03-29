import { Router } from 'express'
import imageController from '../controllers/image.controller'
import { imageRequestValidator } from '../requestValidator/index'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Image
 */

/**
 * @swagger
 *  /:
 *    get:
 *      description: Cache the target image. Images can also be converted and resized. *Svg will not be convert!
 *      tags:
 *        - Image
 *      parameters:
 *        - name: url
 *          description: target image url
 *          in: query
 *          schema:
 *            type: string
 *          required: true
 *          example: https://example.com/image.jpg
 *        - name: cacheId
 *          description: An id use to create a new redis cache. Use it when you need to update cached image with the same parameters
 *          in: query
 *          schema:
 *            type: string
 *          default: default
 *          example: 20231011
 *        - name: ext
 *          description:
 *            File extension which you want to convert
 *          in: query
 *          schema:
 *            type: string
 *            enum: [avif, webp, jpg, jpeg, png, gif]
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
 *      description: Clear cache from specific url. Send DELETE request with url which you use in GET request. All parameter must be the same.
 *      tags:
 *        - Image
 *      parameters:
 *        - name: url
 *          description: target image url
 *          in: query
 *          schema:
 *            type: string
 *          required: true
 *          example: https://example.com/image.jpg
 *        - name: cacheId
 *          description: An id use to create a new redis cache. Use it when you need to update cached image with the same parameters
 *          in: query
 *          schema:
 *            type: string
 *          default: default
 *          example: 20231011
 *        - name: ext
 *          description:
 *            File extension which you want to convert
 *          in: query
 *          schema:
 *            type: string
 *            enum: [avif, webp, jpg, jpeg, png, gif]
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
 *        default:
 *          description: response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: error message
 */

router.get('/', imageRequestValidator, imageController.handleImage)
router.delete('/', imageRequestValidator, imageController.clearCache)

export default router
