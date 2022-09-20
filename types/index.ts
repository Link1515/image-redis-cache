import type { Request } from 'express'

export type QueryString = string | undefined

export type Ext = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'avif'

export type Fit = 'cover' | 'contain'

export interface RequestImage extends Request {
  checkedVar?: {
    src: string
    ext: Exclude<Ext, 'jpg'>
    width: number | undefined
    height: number | undefined
    fit: Fit
  }
}
