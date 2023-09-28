import { createLogger, format, transports } from 'winston'

const { combine, timestamp, colorize, errors, printf, json } = format

export const logger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors())
})

logger.add(
  new transports.Console({
    format: combine(
      format(info => {
        info.level = info.level.toUpperCase()
        return info
      })(),
      colorize(),
      printf(info => {
        const { level, timestamp, message, ...rest } = info as {
          level: string
          timestamp: string
          message: string
        }

        let restString = JSON.stringify(rest, undefined, 2)
        restString = restString === '{}' ? '' : `\n${restString}\n`

        return `[${timestamp}] ${level} - ${message} ${restString}`
      })
    )
  })
)

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: json()
    })
  )

  logger.add(
    new transports.File({
      filename: 'logs/all.log',
      format: json()
    })
  )
}
