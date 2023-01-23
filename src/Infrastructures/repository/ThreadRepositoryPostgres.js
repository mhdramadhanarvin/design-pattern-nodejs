const AddedThread = require("../../Domains/threads/entities/AddedThread") 
const ThreadRepository = require("../../Domains/threads/ThreadRepository")
const NotFoundError = require("../../Commons/exceptions/NotFoundError")

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator 
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: "INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id, title, owner",      
      values: [id, title, body, owner]
    }

    const result = await this._pool.query(query) 

    return new AddedThread({ ...result.rows[0] })
  }

  async checkThreadExist(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    }

    const { rowCount } = await this._pool.query(query)

    if (rowCount === 0) {
      throw new NotFoundError("thread tidak ditemukan")
    }
  }

  async detailThread(threadId) {
    const query = {
      text: "SELECT threads.id, threads.title, threads.body, threads.created_at as date, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1",
      values: [threadId]
    }
    
    const { rows } = await this._pool.query(query)
    return rows[0]

  }
}

module.exports = ThreadRepositoryPostgres