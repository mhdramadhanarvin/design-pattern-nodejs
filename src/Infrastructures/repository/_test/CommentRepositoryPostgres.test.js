const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const AddedComment = require("../../../Domains/comments/entities/AddedComment")
const AddComment = require("../../../Domains/comments/entities/AddComment")
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres")

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-12345"  })
    await ThreadsTableTestHelper.addThread({ id: "thread-123", body: "thread biasa", owner: "user-12345" })
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
    it("should persist add comment and return thread correctly", async () => {
      const newComment = new AddComment({
        content: "sebuah komentar",
        thread: "thread-123",
        owner: "user-12345",
      })

      const fakeIdGenerator = () => "12345"
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      const addedComment = await commentRepositoryPostgres.addComment(newComment)

      const comment = await CommentsTableTestHelper.findCommentsById("comment-12345")
      expect(addedComment).toStrictEqual(new AddedComment({
        id: "comment-12345",
        content: "sebuah komentar",
        owner: "user-12345",
      }))
      expect(comment).toHaveLength(1) 
    }) 
  }) 
})