const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool") 
const LikesCommentRepositoryPostgres = require("../LikesCommentRepositoryPostgres") 
const LikeCommentsTableTestHelper = require("../../../../tests/LikeCommentsTableTestHelper")

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-12345", username: "user-12345" })
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      body: "thread biasa",
      owner: "user-12345",
    })
    await CommentsTableTestHelper.addComment({
      id: "comment-123",
      content: "komentar biasa",
      thread: "thread-123",
      owner: "user-12345",
      likes: 0
    }) 
  })

  afterEach(async () => {
    await LikeCommentsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe("hasLikeComment function", () => {
    it("should return true when user like comment", async () => {
      const payload = {
        id: "likecomment-123", 
        comment: "comment-123", 
        owner: "user-12345"
      }
      await LikeCommentsTableTestHelper.addUserLike(payload)
 
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {})

      const likeComment = await likesCommentRepositoryPostgres.hasLikeComment(payload.comment, payload.owner)

      expect(likeComment).toBe(true)
    })
    it("should return false when user not like comment", async () => { 
 
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {})

      const likeComment = await likesCommentRepositoryPostgres.hasLikeComment("comment-123", "user-123")

      expect(likeComment).toBe(false)
    })
  })
  describe("addUserComment function", () => {
    it("should add user comment correctly", async () => {
      const fakeIdGenerator = () => "12345"
      const likeCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator)

      await likeCommentRepositoryPostgres.addUserComment("comment-123", "user-12345")

      const likeComment = await LikeCommentsTableTestHelper.findUserLikeCommentsById("likecomment-12345")
      
      expect(likeComment).toHaveLength(1)
      expect(likeComment[0].comment).toBe("comment-123")
      expect(likeComment[0].owner).toBe("user-12345")
    })
  })
  describe("removeUserComment function", () => {
    it("should remove user comment correctly", async () => {
      const payload = {
        id: "likecomment-123",
        comment: "comment-123",
        owner: "user-12345"
      }
      await LikeCommentsTableTestHelper.addUserLike(payload)

      const likeCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {})
      await likeCommentRepositoryPostgres.removeUserComment(payload.comment, payload.owner)

      const likeComment = await LikeCommentsTableTestHelper.findUserLikeCommentsById("likecomment-123")
      
      expect(likeComment).toHaveLength(0) 
    })
  }) 
})
