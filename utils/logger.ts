import { createLogger, format, transports } from 'winston'

const { combine, timestamp, colorize, errors, printf } = format

export const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    errors(),
    printf(info => {
      const { level, timestamp, message, ...rest } = info as {
        level: string
        timestamp: string
        message: string
      }

      let restString = JSON.stringify(rest, undefined, 2)
      restString = restString === '{}' ? '' : restString

      return `[${timestamp}] ${level} - ${message} \n${restString}\n`
    })
  ),
  transports: [new transports.Console()]
})

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: format.json()
    })
  )

  logger.add(
    new transports.File({
      filename: 'all.log',
      format: format.json()
    })
  )
}
