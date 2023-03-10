const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const AddedComment = require("../../../Domains/comments/entities/AddedComment")
const AddComment = require("../../../Domains/comments/entities/AddComment")
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres")
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-12345", username: "user-12345" })
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      body: "thread biasa",
      owner: "user-12345",
    })
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe("addComment function", () => {
    it("should persist add comment and return comment correctly", async () => {
      const newComment = new AddComment({
        content: "sebuah komentar",
        thread: "thread-123",
        owner: "user-12345",
      })

      const fakeIdGenerator = () => "12345"
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      )

      const comment = await CommentsTableTestHelper.findCommentsById(
        "comment-12345"
      )
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-12345",
          content: "sebuah komentar",
          owner: "user-12345",
        })
      )
      expect(comment).toHaveLength(1)
    })
  })
  describe("deleteComment function", () => {
    it("should correctly delete comment", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        thread: "thread-123",
        owner: "user-12345",
      })
      const commentBeforeDelete =
        await CommentsTableTestHelper.findCommentsById("comment-12345")
      await commentRepositoryPostgres.deleteComment("comment-12345")

      const commentAfterDelete = await CommentsTableTestHelper.findCommentsById(
        "comment-12345"
      )
      expect(commentBeforeDelete).toHaveLength(1)
      expect(commentAfterDelete).toEqual([])
    })
  })
  describe("verifyOwner function", () => {
    it("should not throw AuthorizationError when owner is true", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        thread: "thread-123",
        owner: "user-12345",
      })

      await expect(
        commentRepositoryPostgres.verifyOwner("comment-12345", "user-12345")
      ).resolves.not.toThrow(AuthorizationError)
    })
    it("should throw AuthorizationError when owner is false", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        thread: "thread-123",
        owner: "user-12345",
      })
      
      await expect(() =>
        commentRepositoryPostgres.verifyOwner(
          "comment-12345",
          "user-abcde"
        )
      ).rejects.toThrow(AuthorizationError)
    })
  })
  describe("checkCommentExist function", () => {
    it("should not throw NotFoundError when comment is exist", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        thread: "thread-123",
        owner: "user-12345",
      })

      await expect(
        commentRepositoryPostgres.checkCommentExist("comment-12345")
      ).resolves.not.toThrow(NotFoundError)
    })
    it("should throw NotFoundError when comment doesn't exist", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
      
      await expect(() =>
        commentRepositoryPostgres.checkCommentExist(
          "comment-12345"
        )
      ).rejects.toThrow(NotFoundError)
    })
  })
  describe("getCommentsOnThread function", () => {
    it("should comments on thread correctly", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const payload = {
        id: "comment-12345",
        content: "comment 1",
        thread: "thread-123",
        owner: "user-12345",
      }
      await CommentsTableTestHelper.addComment(payload)

      const comments = await commentRepositoryPostgres.getCommentsOnThread(payload.thread)

      expect(comments).toHaveLength(1)
      expect(comments[0].id).toEqual(payload.id)
      expect(comments[0].username).toEqual("user-12345")
      expect(comments[0].content).toEqual(payload.content)
      expect(comments[0].date).toBeDefined()
    }) 
  })
  describe("addReplyComment function", () => {
    it("should persist add comment and return comment correctly", async () => {

      const fakeIdGenerator = () => "12345"
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      await CommentsTableTestHelper.addComment({  
        id: "comment-123",
        content: "comment biasa", 
        thread: "thread-123",
        owner: "user-12345"
      })

      const payloadAddReplyComment = {
        owner: "user-12345",
        thread: "thread-123",
        comment: "comment-123",
        content: "reply comment-123",
      }

      const addedComment = await commentRepositoryPostgres.addReplyComment(payloadAddReplyComment)

      await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      )
      
      expect(addedComment).toStrictEqual({
        id: "replycomment-12345",
        content: payloadAddReplyComment.content, 
        owner: payloadAddReplyComment.owner, 
        comment: payloadAddReplyComment.comment
      })
    })
  })
  describe("incrementCommentLike function", () => {
    it("should persist increment like comment correctly", async () => {

      const fakeIdGenerator = () => "12345"
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      const payload = {  
        id: "comment-123",
        content: "comment biasa", 
        thread: "thread-123",
        owner: "user-12345",
        likes: 1
      }
  
      await CommentsTableTestHelper.addComment(payload)

      await commentRepositoryPostgres.incrementCommentLike("comment-123")

      const comment = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      )
      
      expect(comment[0].likes).toEqual(payload.likes + 1)
    })
  })
  describe("decrementCommentLike function", () => {
    it("should persist decrement like comment correctly", async () => {

      const fakeIdGenerator = () => "12345"
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      const payload = {  
        id: "comment-123",
        content: "comment biasa", 
        thread: "thread-123",
        owner: "user-12345",
        likes: 1
      }
  
      await CommentsTableTestHelper.addComment(payload)

      await commentRepositoryPostgres.decrementCommentLike("comment-123")

      const comment = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      )
      
      expect(comment[0].likes).toEqual(payload.likes - 1)
    })
  })
})
