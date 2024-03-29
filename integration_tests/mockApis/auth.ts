import jwt from 'jsonwebtoken'
import { Response } from 'superagent'

import { stubForAuth, getAuthRequests } from './wiremock'
import tokenVerification from './tokenVerification'

const createToken = () => {
  const payload = {
    user_name: 'USER1',
    scope: ['read'],
    auth_source: 'nomis',
    authorities: ['ROLE_MANAGE_A_WORKFORCE_ALLOCATE'],
    jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

const getSignInUrl = async (): Promise<string> => {
  const {
    body: {
      requests: [
        {
          request: {
            queryParams: {
              state: {
                values: [stateParam],
              },
            },
          },
        },
      ],
    },
  } = await getAuthRequests()
  return `/sign-in/callback?code=codexxxx&state=${stateParam}`
}

const favicon = () =>
  stubForAuth({
    request: {
      method: 'GET',
      urlPattern: '/favicon.ico',
    },
    response: {
      status: 200,
    },
  })

const ping = () =>
  stubForAuth({
    request: {
      method: 'GET',
      urlPattern: '/auth/health/ping',
    },
    response: {
      status: 200,
    },
  })

const redirect = () =>
  stubForAuth({
    request: {
      method: 'GET',
      urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=clientid',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        Location: 'http://127.0.0.1:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      body: '<html><body>SignIn page<h1>Sign in</h1></body></html>',
    },
  })

const signOut = () =>
  stubForAuth({
    request: {
      method: 'GET',
      urlPattern: '/auth/sign-out.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body>SignIn page<h1>Sign in</h1></body></html>',
    },
  })

const token = () =>
  stubForAuth({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://127.0.0.1:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      jsonBody: {
        access_token: createToken(),
        token_type: 'bearer',
        user_name: 'USER1',
        expires_in: 599,
        scope: 'read',
        internalUser: true,
      },
    },
  })

export default {
  getSignInUrl,
  stubAuthPing: (): Promise<[Response, Response]> =>
    Promise.all([ping(), tokenVerification.stubTokenVerificationPing()]),
  stubSignIn: (): Promise<[Response, Response, Response, Response, Response]> =>
    Promise.all([favicon(), redirect(), signOut(), token(), tokenVerification.stubVerifyToken()]),
}
