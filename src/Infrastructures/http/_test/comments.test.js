/* eslint-disable no-undef */
const pool = require("../../database/postgres/pool")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const container = require("../../container")
const createServer = require("../createServer")

describe("/threads/{threadId}/comments endpoint", () => {
  afterAll(async () => {
    await pool.end()
  })

  beforeEach(async () => {
    const userPayload = {
      username: "dicoding123",
      password: "dicoding123",
      fullname: "Dicoding Indonesia"
    }
    
    const threadPayload = {
      title: "title dicoding",
      body: "body dicoding", 
    } 
    
    server = await createServer(container)

    await server.inject({
      method: "POST",
      url: "/users",
      payload: userPayload,
    }) 

    const authentication = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: userPayload,
    })

    responseAuth = JSON.parse(authentication.payload)

    thread = await server.inject({
      method: "POST",
      url: "/threads",
      payload: threadPayload,
      headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
    })

    threadId = JSON.parse(thread.payload).data.addedThread.id 
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe("when POST /comments", () => {
    it("should response 201 and persisted thread", async () => {
      // Arrange 
      const requestPayload = {
        content: "body dicoding", 
      }  

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload) 
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual("success") 
    })

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {}
      
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada")
    })

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        content: {}
      }
    
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("tidak dapat membuat komentar baru karena tipe data tidak sesuai")
    }) 
    
    it("should response 404 when request payload thread does not exist", async () => {
      // Arrange
      const requestPayload = {
        content: "comment biasa"
      }
    
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("thread tidak ditemukan")
    }) 

    it("should response 401 when no authentication", async () => {
      // Arrange
      const requestPayload = {
        content: "Dicoding Indonesia",
      }
      
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      })       

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401) 
      expect(responseJson.error).toEqual("Unauthorized")
      expect(responseJson.message).toEqual("Missing authentication")
    })
  })
})
