const ThreadRepository = require("../../Domains/threads/ThreadRepository")
const AddedComment = require("../../Domains/comments/entities/AddedComment")
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError")

class CommentRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment
    const id = `comment-${this._idGenerator()}` 
    
    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4) RETURNING id, content, owner",      
      values: [id, content, thread, owner]
    }

    const result = await this._pool.query(query)

    return new AddedComment({ ...result.rows[0] })
  }

  async deleteComment(commentId) {
    const deleted_at = new Date().toISOString()
    
    const query = {
      text: "UPDATE comments SET deleted_at = $1 WHERE id = $2",
      values: [deleted_at, commentId]
    }

    await this._pool.query(query) 
  }

  async verifyOwner(commentId, owner) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, owner]
    }

    const { rowCount } = await this._pool.query(query)
    
    if (!rowCount) {
      throw new AuthorizationError("bukan pemilik komentar")
    }
  }
}

module.exports = CommentRepositoryPostgres