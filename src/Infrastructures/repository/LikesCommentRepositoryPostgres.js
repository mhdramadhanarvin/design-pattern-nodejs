const LikesCommentRepository = require("../../Domains/likes_comment/LikesCommentRepository")

class LikesCommentRepositoryPostgres extends LikesCommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async hasLikeComment(comment, owner) { 
    const query = {
      text: "SELECT * FROM comment_likes WHERE comment = $1 AND owner = $2",      
      values: [comment, owner]
    }

    const { rowCount } = await this._pool.query(query)

    if (rowCount === 1) return true
    return false
  } 

  async addUserComment(comment, owner) {
    const id = `likecomment-${this._idGenerator()}` 

    const query = {
      text: "INSERT INTO comment_likes VALUES ($1, $2, $3) RETURNING id, comment, owner",
      values: [id, comment, owner]
    }

    const { rows } = await this._pool.query(query)
    
    return rows
  }

  async removeUserComment(comment, owner) {
    const query = {
      text: "DELETE FROM comment_likes WHERE comment = $1 AND owner = $2",
      values: [comment, owner]
    }

    await this._pool.query(query)
  }
}

module.exports = LikesCommentRepositoryPostgres