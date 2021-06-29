import bcrypt from 'bcrypt'
import config from 'config'
import jwt from 'jsonwebtoken'

export interface JwtToken {
  sub: string
  scopes: string[]
}

class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  public static generateToken(sub: string, scopes: string[] = []): string {
    return jwt.sign({ sub, scopes }, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.tokenExpiresIn')
    })
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, config.get('App.auth.key')) as JwtToken
  }
}

export default AuthService
