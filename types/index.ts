export type QueryString = string | undefined

export type Ext = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'avif'

export type Fit = 'cover' | 'contain'

export interface ImageResizeProperty {
  width: number | undefined
  height: number | undefined
  fit: Fit
}

export interface ImageQueries {
  url: string
  ext: Exclude<Ext, 'jpg'>
  width: number | undefined
  height: number | undefined
  fit: Fit
}
