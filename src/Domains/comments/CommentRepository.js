/* eslint-disable no-unused-vars */

class CommentRepository {
  async addComment(newComment) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED")
  }
  async deleteComment(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED")
  }
  async verifyOwner(comment, owner) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED")
  }
  async checkCommentExist(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED")
  }
  async detailComment(comments) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED")
  }
}

module.exports = CommentRepository