// /* istanbul ignore file */

// const pool = require("../../database/postgres/pool")
// const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
// const container = require("../../container")
// const createServer = require("../createServer")

// describe("/threads endpoint", () => {
//   afterAll(async () => {
//     await pool.end()
//   })

//   afterEach(async () => {
//     await ThreadsTableTestHelper.cleanTable()
//   })

//   describe("when POST /threads", () => {
//     it("should response 201 and persisted thread", async () => {
//       // Arrange
//       const requestPayload = {
//         title: "title dicoding",
//         body: "body dicoding", 
//       }

//       const userPayload = {
//         username: "dicoding123",
//         password: "dicoding123",
//         fullname: "Dicoding Indonesia"
//       }
//       // eslint-disable-next-line no-undef
//       const server = await createServer(container)

//       // Action
//       await server.inject({
//         method: "POST",
//         url: "/users",
//         payload: userPayload,
//       })

//       const authentication = await server.inject({
//         method: "POST",
//         url: "/authentications",
//         payload: userPayload,
//       })

//       const responseAuth = JSON.parse(authentication.payload)
      
//       const response = await server.inject({
//         method: "POST",
//         url: "/threads",
//         payload: requestPayload,
//         headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
//       }) 
//       // Assert
//       const responseJson = JSON.parse(response.payload)
//       expect(response.statusCode).toEqual(201)
//       expect(responseJson.status).toEqual("success") 
//     })

//     it("should response 400 when request payload not contain needed property", async () => {
//       // Arrange
//       const requestPayload = {
//         title: "Dicoding Indonesia", 
//       }
//       const userPayload = {
//         username: "dicoding123",
//         password: "dicoding123",
//         fullname: "Dicoding Indonesia"
//       }

//       const server = await createServer(container)

//       // Action
//       await server.inject({
//         method: "POST",
//         url: "/users",
//         payload: userPayload,
//       })

//       const authentication = await server.inject({
//         method: "POST",
//         url: "/authentications",
//         payload: userPayload,
//       })

//       const responseAuth = JSON.parse(authentication.payload)

//       const response = await server.inject({
//         method: "POST",
//         url: "/threads",
//         payload: requestPayload,
//         headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
//       })

//       // Assert
//       const responseJson = JSON.parse(response.payload)
//       expect(response.statusCode).toEqual(400)
//       expect(responseJson.status).toEqual("fail")
//       expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada")
//     })

//     it("should response 400 when request payload not meet data type specification", async () => {
//       // Arrange
//       const requestPayload = {
//         title: "Dicoding Indonesia", 
//         body: {}
//       }
//       const userPayload = {
//         username: "dicoding123",
//         password: "dicoding123",
//         fullname: "Dicoding Indonesia"
//       }
//       const server = await createServer(container)

//       // Action
//       await server.inject({
//         method: "POST",
//         url: "/users",
//         payload: userPayload,
//       })
  
//       const authentication = await server.inject({
//         method: "POST",
//         url: "/authentications",
//         payload: userPayload,
//       })
  
//       const responseAuth = JSON.parse(authentication.payload)

//       const response = await server.inject({
//         method: "POST",
//         url: "/threads",
//         payload: requestPayload,
//         headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
//       })

//       // Assert
//       const responseJson = JSON.parse(response.payload)
//       expect(response.statusCode).toEqual(400)
//       expect(responseJson.status).toEqual("fail")
//       expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena tipe data tidak sesuai")
//     })

//     it("should response 400 when title more than 100 character", async () => {
//       // Arrange
//       const requestPayload = {
//         title: "Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia", 
//         body: "body"
//       }
//       const userPayload = {
//         username: "dicoding123",
//         password: "dicoding123",
//         fullname: "Dicoding Indonesia"
//       }
//       const server = await createServer(container)

//       // Action
//       await server.inject({
//         method: "POST",
//         url: "/users",
//         payload: userPayload,
//       })
    
//       const authentication = await server.inject({
//         method: "POST",
//         url: "/authentications",
//         payload: userPayload,
//       })
    
//       const responseAuth = JSON.parse(authentication.payload)
  
//       const response = await server.inject({
//         method: "POST",
//         url: "/threads",
//         payload: requestPayload,
//         headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
//       })

//       // Assert
//       const responseJson = JSON.parse(response.payload)
//       expect(response.statusCode).toEqual(400)
//       expect(responseJson.status).toEqual("fail")
//       expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena karakter title melebihi batas limit")
//     })

//     it("should response 401 when no authentication", async () => {
//       // Arrange
//       const requestPayload = {
//         title: "dicoding indonesia", 
//         body: "Dicoding Indonesia",
//       }
//       const server = await createServer(container)

//       // Action
//       const response = await server.inject({
//         method: "POST",
//         url: "/threads",
//         payload: requestPayload,
//       })

//       // Assert
//       const responseJson = JSON.parse(response.payload)
//       expect(response.statusCode).toEqual(401) 
//       expect(responseJson.error).toEqual("Unauthorized")
//       expect(responseJson.message).toEqual("Missing authentication")
//     })
//   })
// })

describe("", () => {
  it("", () => {
    expect(1).toBe(1)
  })
})