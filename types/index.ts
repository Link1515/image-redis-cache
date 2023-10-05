export type Ext = 'jpeg' | 'png' | 'gif' | 'webp' | 'avif'

export type Fit = 'cover' | 'contain'

export interface ImageResizeProperty {
  width: number | undefined
  height: number | undefined
  fit: Fit
}
