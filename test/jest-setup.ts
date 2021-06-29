// import { SetupServer } from '@src/server'
// import supertest from 'supertest'

// let server: SetupServer

beforeAll(async () => {
  // server = new SetupServer()
  // await server.init()
  // global.testRequest = supertest(server.getApp())
  console.log('before all')
})

afterAll(async () => {
  console.log('after all')
  // await server.close()
})
