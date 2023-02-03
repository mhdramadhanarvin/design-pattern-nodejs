/* istanbul ignore file  */

const pool = require("../src/Infrastructures/database/postgres/pool")

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123", content = "comment biasa", thread = "thread-123", owner = "user-123", likes = 0
  }) {
    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)",
      values: [id, content, thread, owner, null, likes]
    }

    await pool.query(query)
  },

  async findCommentsById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND deleted_at IS NULL",
      values: [id]
    }

    const { rows } = await pool.query(query) 
    return rows
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1")
  },
}

module.exports = CommentsTableTestHelper