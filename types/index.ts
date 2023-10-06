export type Ext = 'jpeg' | 'png' | 'gif' | 'webp' | 'avif'

export type Fit = 'cover' | 'contain'

export interface ImageResizeProperty {
  width: number | undefined
  height: number | undefined
  fit: Fit
}

export interface ImageQueryParams {
  url: string
  cacheId: string
  fit: Fit
  ext: Ext
  w?: number
  h?: number
}
