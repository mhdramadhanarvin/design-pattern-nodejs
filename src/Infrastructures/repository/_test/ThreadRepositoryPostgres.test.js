const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const AddedThread = require("../../../Domains/threads/entities/AddedThread")
const AddThread = require("../../../Domains/threads/entities/AddThread")
const pool = require("../../database/postgres/pool")
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres")

describe("ThreadRepositoryPostgres", () => {
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
        owner: "user-123"
      })
      const fakeIdGenerator = () => "123"
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // // Action
      await UsersTableTestHelper.addUser({ id: "user-123" })
      await threadRepositoryPostgres.addThread(addThread)

      // // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById("thread-123")
      expect(threads).toHaveLength(1) 
    })

    it("should return new threads correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "dicoding",
        body: "Dicoding Indonesia",
        owner: "user-123"
      })
      const fakeIdGenerator = () => "123" // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await UsersTableTestHelper.addUser({ id: "user-123" })
      const addedThread = await threadRepositoryPostgres.addThread(addThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({ 
        id: "thread-123",
        title: "dicoding",
        owner: "user-123"
      }))
    })
  })
})