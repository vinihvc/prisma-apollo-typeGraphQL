import { verify } from 'jsonwebtoken'

import { ContextProps } from 'src/context'

export const APP_SECRET = 'appsecret321'

type TokenProps = {
  userId: string
}

function checkToken(context: ContextProps): number | null {
  const authHeader = context.req.get('Authorization')

  if (!authHeader) {
    throw new Error('Token not provided.')
  }

  try {
    const token = authHeader.replace('Bearer ', '')

    const verifiedToken = verify(token, APP_SECRET) as TokenProps

    return verifiedToken && Number(verifiedToken.userId)
  } catch {
    throw new Error('Invalid token.')
  }
}

export default checkToken
