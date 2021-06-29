import nodemailer, { Transporter } from 'nodemailer'
import config, { IConfig } from 'config'
import { Service } from 'typedi'

import { InternalError } from '../utils/errors/internal-error'

const emailConfig: IConfig = config.get('App.resources.email')

export class EmailResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the Email service'
    super(`${internalMessage}: ${message}`)
  }
}

@Service()
export default class Email {
  private transporter: Transporter
  private from = '"Summer Eletro Hits" <noreply@summereltro.com.br>'

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.get('hostname'),
      port: emailConfig.get('port') || 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailConfig.get('username'),
        pass: emailConfig.get('password')
      },
      logger: true
    })
  }

  async send(to: string, subject: string, html: string, text?: string) {
    try {
      await this.transporter.sendMail({
        from: this.from,
        subject,
        to,
        text,
        html
      })
    } catch (error) {
      throw new EmailResponseError(error.message)
    }
  }
}
