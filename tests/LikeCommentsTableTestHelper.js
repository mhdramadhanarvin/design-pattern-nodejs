/* istanbul ignore file  */

const pool = require("../src/Infrastructures/database/postgres/pool")

const LikeCommentsTableTestHelper = {
  async addUserLike({
    id = "commentlike-123", comment = "comment-123", owner = "user-123"
  }) {
    const query = {
      text: "INSERT INTO comment_likes VALUES ($1, $2, $3)",
      values: [id, comment, owner]
    }

    await pool.query(query)
  },

  async findUserLikeCommentsById(id) {
    const query = {
      text: "SELECT * FROM comment_likes WHERE id = $1",
      values: [id]
    }

    const { rows } = await pool.query(query) 
    return rows
  },

  async cleanTable() {
    await pool.query("DELETE FROM comment_likes WHERE 1=1")
  },
}

module.exports = LikeCommentsTableTestHelper