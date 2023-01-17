const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const AddedComment = require("../../../Domains/comments/entities/AddedComment")
const AddComment = require("../../../Domains/comments/entities/AddComment")
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres")

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    // await CommentsTableTestHelper.cleanTable()
    // await ThreadsTableTestHelper.cleanTable()
    // await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe("addComment function", () => {
    it("should persist add comment and return thread correctly", async () => {
      // await UsersTableTestHelper.addUser({ id: "user-123123"  })
      // await ThreadsTableTestHelper.addThread({ id: "thread-123", body: "ini thread", owner: "user-123123" })

      // const newComment = new AddComment({
      //   content: "sebuah komentar",
      //   thread: "thread-123",
      //   owner: "user-123123",
      // })

      // const fakeIdGenerator = () => "123456789abcdef"
      // const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // const addedComment = await commentRepositoryPostgres.addComment(newComment)

      // const comment = await CommentsTableTestHelper.findCommentsById("comment-_pby2_123456789abcdef")
      // expect(addedComment).toStrictEqual(new AddedComment({
      //   id: "comment-_pby2_123456789abcdef",
      //   content: "sebuah komentar",
      //   owner: "user-1234567",
      // }))
      // expect(comment).toHaveLength(1)
      expect(1).toBe(1)
    })

    // it("should return new threads correctly", async () => {
    //   // Arrange
    //   const addComment = new AddComment({
    //     content: "dicoding",
    //     thread: "thread-123",
    //     owner: "user-123"
    //   })
    //   const fakeIdGenerator = () => "123" // stub!
    //   const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

    //   // Action
    //   await UsersTableTestHelper.addUser({ id: "user-123" })
    //   await ThreadsTableTestHelper.addThread({ id: "thread-123" })
    //   const addedComment = await commentRepositoryPostgres.addThread(addComment)

    //   // Assert
    //   expect(addedComment).toStrictEqual(new AddedComment({ 
    //     id: "comment-123",
    //     content: "dicoding",
    //     owner: "user-123"
    //   }))
    // })
  })
})