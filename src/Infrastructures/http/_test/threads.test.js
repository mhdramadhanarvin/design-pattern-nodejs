/* eslint-disable no-undef */
const pool = require("../../database/postgres/pool")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const container = require("../../container")
const createServer = require("../createServer") 

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      // Arrange
      const requestPayload = {
        title: "title dicoding",
        body: "body dicoding", 
      }

      const userPayload = {
        username: "dicoding123",
        password: "dicoding123",
        fullname: "Dicoding Indonesia"
      }
      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
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

      const responseAuth = JSON.parse(authentication.payload)
      
      const response = await server.inject({
        method: "POST",
        url: "/threads",
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
      const requestPayload = {
        title: "Dicoding Indonesia", 
      }
      const userPayload = {
        username: "dicoding123",
        password: "dicoding123",
        fullname: "Dicoding Indonesia"
      }

      const server = await createServer(container)

      // Action
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

      const responseAuth = JSON.parse(authentication.payload)

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada")
    })

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        title: "Dicoding Indonesia", 
        body: {}
      }
      const userPayload = {
        username: "dicoding123",
        password: "dicoding123",
        fullname: "Dicoding Indonesia"
      }
      const server = await createServer(container)

      // Action
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
  
      const responseAuth = JSON.parse(authentication.payload)

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena tipe data tidak sesuai")
    })

    it("should response 400 when title more than 100 character", async () => {
      // Arrange
      const requestPayload = {
        title: "Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia Dicoding Indonesia", 
        body: "body"
      }
      const userPayload = {
        username: "dicoding123",
        password: "dicoding123",
        fullname: "Dicoding Indonesia"
      }
      const server = await createServer(container)

      // Action
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
    
      const responseAuth = JSON.parse(authentication.payload)
  
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena karakter title melebihi batas limit")
    })

    it("should response 401 when no authentication", async () => {
      // Arrange
      const requestPayload = {
        title: "dicoding indonesia", 
        body: "Dicoding Indonesia",
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401) 
      expect(responseJson.error).toEqual("Unauthorized")
      expect(responseJson.message).toEqual("Missing authentication")
    })
  })
  describe("when GET /threads/{threadId}", () => {

    beforeEach(async () => {
      // Arrange
      threadPayload = {
        title: "title dicoding",
        body: "body dicoding", 
      }

      userPayload = {
        username: "dicoding123",
        password: "dicoding123",
        fullname: "Dicoding Indonesia"
      }

      comment1Payload = {
        content: "comment 1"
      }
      
      comment2Payload = {
        content: "comment 2"
      }
      
      server = await createServer(container)

      // Action
      await server.inject({
        method: "POST",
        url: "/users",
        payload: userPayload,
      })

      authentication = await server.inject({
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

      addComment1 = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: comment1Payload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      responseComment1 = JSON.parse(addComment1.payload)
      comment1Id = responseComment1.data.addedComment.id 
      
      addComment2 = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: comment2Payload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      responseComment2 = JSON.parse(addComment2.payload)

      deleteComment1 = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${comment1Id}`, 
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })
    })

    it("should response 200 and persisted thread detail", async () => {
      
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      })
      
      
      // Assert
      const responseJson = JSON.parse(response.payload)  
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual("success")  
      expect(responseJson.data.thread.id).toEqual(threadId)
      expect(responseJson.data.thread.title).toEqual(threadPayload.title)
      expect(responseJson.data.thread.body).toEqual(threadPayload.body)
      expect(responseJson.data.thread.username).toEqual(userPayload.username)
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true)
      expect(responseJson.data.thread.comments).toHaveLength(2)
      expect(responseJson.data.thread.comments[0].content).toEqual("**komentar telah dihapus**")
      expect(responseJson.data.thread.comments[1].content).toEqual(comment2Payload.content)
    })

    it("should response 404 when thread doesn't exist", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-123"
      })      
      
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("thread tidak ditemukan")
    })
  })
})
