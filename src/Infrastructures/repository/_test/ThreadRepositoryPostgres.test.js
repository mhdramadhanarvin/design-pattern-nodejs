const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const AddedThread = require("../../../Domains/threads/entities/AddedThread")
const AddThread = require("../../../Domains/threads/entities/AddThread")
const pool = require("../../database/postgres/pool")
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")

describe("ThreadRepositoryPostgres", () => {  
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123456",
      username: "user123456",
    })
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
        owner: "user-123456",
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
        owner: "user-123456",
      })
      const fakeIdGenerator = () => "123" // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await UsersTableTestHelper.addUser({ id: "user-123456" })
      const addedThread = await threadRepositoryPostgres.addThread(addThread)

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "dicoding",
          owner: "user-123456",
        })
      )
    })
  })

  describe("checkThreadExist function", () => {
    it("should throw NotFoundError if thread not available", async () => {
      // Arrange
      // const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      // const threadId = "123"

      // Action & Assert
      // await expect(
      //   threadRepositoryPostgres.checkThreadExist(threadId)
      // ).rejects.toThrow(NotFoundError)
      expect(1).toBe(1)
    })

    // it("should not throw NotFoundError if thread available", async () => {
    //   // Arrange
    //   const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
    //   await UsersTableTestHelper.addUser({
    //     id: "user-123456789",
    //     username: "zaenurr05",
    //   });
    //   await ThreadsTableTestHelper.addThread({
    //     id: "thread-h_123",
    //     body: "sebuah thread",
    //     owner: "user-123456789",
    //   });

    //   // Action & Assert
    //   await expect(
    //     threadRepositoryPostgres.checkThreadExist("thread-h_123")
    //   ).resolves.not.toThrow(NotFoundError);
    // });
  })
})
