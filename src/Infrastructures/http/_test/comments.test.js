/* eslint-disable no-undef */
const pool = require("../../database/postgres/pool")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const container = require("../../container")
const createServer = require("../createServer")

describe("/threads/{threadId}/comments and /threads/{threadId}/comments/{commentId} endpoint", () => {
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

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
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
  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 and persisted thread", async () => {
      
      // Action
      // Add comment before
      const addComment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "sebuah komentar"
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 
      // delete the comment
      const commentId = JSON.parse(addComment.payload).data.addedComment.id 
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`, 
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual("success") 
    })

    it("should response 403 when delete other people comment's", async () => {
      // Arrange
      const requestPayload = {
        content: "komentar biasa"
      }
      
      // Action
      // add user2 and login 
      const userPayload2 = {
        username: "dicoding12345",
        password: "dicoding12345",
        fullname: "Dicoding Indonesia"
      }  
  
      await server.inject({
        method: "POST",
        url: "/users",
        payload: userPayload2,
      }) 
  
      const authentication2 = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: userPayload2,
      })
  
      responseAuth2 = JSON.parse(authentication2.payload)
      // add comment on user 1
      const addComment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 
      // delete the comment on user 2
      const commentId = JSON.parse(addComment.payload).data.addedComment.id 
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`, 
        headers: { Authorization: `Bearer ${responseAuth2.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("bukan pemilik komentar")
    })

    it("should response 404 when delete comment but doesn't exist", async () => {
    
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123", 
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("komentar tidak ditemukan")
    })  

    it("should response 401 when no authentication", async () => {
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123",  
      })     

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401) 
      expect(responseJson.error).toEqual("Unauthorized")
      expect(responseJson.message).toEqual("Missing authentication")
    })
  })
  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    beforeEach(async () => {
      // Arrange 
      const addCommentPayload = {
        content: "body dicoding", 
      }  

      // Action
      addComment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: addCommentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      commentId = JSON.parse(addComment.payload).data.addedComment.id
    })
    it("should response 201 and persisted comment", async () => {
      // Arrange
      const addReplyCommentPayload = {
        content: "reply comment "
      }

      // Action 
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: addReplyCommentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload) 
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual("success")
    })

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const addReplyCommentPayload = {}

      // Action 
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: addReplyCommentPayload,
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
      const addReplyCommentPayload = {
        content: {}
      }

      // Action 
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: addReplyCommentPayload,
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
      // Arrange
      const addReplyCommentPayload = {
        content: "reply comment "
      }

      // Action 
      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-abc/comments/${commentId}/replies`,
        payload: addReplyCommentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("thread tidak ditemukan")
    }) 
    
    it("should response 404 when request payload comment does not exist", async () => {
      // Arrange
      // Arrange
      const addReplyCommentPayload = {
        content: "reply comment "
      }

      // Action 
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/comment-abc/replies`,
        payload: addReplyCommentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual("fail")
      expect(responseJson.message).toEqual("komentar tidak ditemukan")
    }) 

    it("should response 401 when no authentication", async () => {
      // Arrange
      const addReplyCommentPayload = {
        content: "reply comment "
      }

      // Action 
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: addReplyCommentPayload, 
      }) 

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401) 
      expect(responseJson.error).toEqual("Unauthorized")
      expect(responseJson.message).toEqual("Missing authentication")
    })
  })
})
