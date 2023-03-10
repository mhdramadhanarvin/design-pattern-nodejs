const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const AddedThread = require("../../../Domains/threads/entities/AddedThread")
const AddThread = require("../../../Domains/threads/entities/AddThread")
const pool = require("../../database/postgres/pool")
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")

describe("ThreadRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-abc123456", username: "username" })
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe("addThread function", () => {
    it("should persist add thread and return thread correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "dicoding",
        body: "Dicoding Indonesia",
        owner: "user-abc123456",
      })
      const fakeIdGenerator = () => "123"
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await threadRepositoryPostgres.addThread(addThread)

      // // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      )
      expect(threads).toHaveLength(1)
    })

    it("should return new threads correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "dicoding",
        body: "Dicoding Indonesia",
        owner: "user-abc123456",
      })
      const fakeIdGenerator = () => "123" // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread)

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "dicoding",
          owner: "user-abc123456",
        })
      )
    })
  })

  describe("checkThreadExist function", () => {
    it("should throw NotFoundError if thread not exist", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      const threadId = "thread-123456"

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkThreadExist(threadId)
      ).rejects.toThrow(NotFoundError)
    })

    it("should not throw NotFoundError if thread exist", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      await ThreadsTableTestHelper.addThread({
        id: "thread-123456",
        body: "thread biasa",
        owner: "user-abc123456",
      })

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkThreadExist("thread-123456")
      ).resolves.not.toThrow(NotFoundError)
    })
  })

  describe("detailThread function", () => {
    it("should return correctly", async () => {
      // Arrange
      const payload = {
        id: "thread-12345",
        title: "sebuah judul thread",
        body: "sebuah thread",
        owner: "user-abc123456",
      }
      await ThreadsTableTestHelper.addThread(payload)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      const detailThread = await threadRepositoryPostgres.detailThread(payload.id)

      expect(detailThread.id).toEqual(payload.id)
      expect(detailThread.title).toEqual(payload.title)
      expect(detailThread.body).toEqual(payload.body)
      expect(detailThread.username).toEqual("username")
    }) 
  })
})
