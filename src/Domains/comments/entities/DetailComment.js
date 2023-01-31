class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload)

    const comments = this._mappingCommentPayload(payload)

    this.comments = comments
  }

  _verifyPayload({ comments }) {
    if (!comments) {
      throw new Error("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
    }

    if (!Array.isArray(comments)) {
      throw new Error("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
    } 
  }

  _mappingCommentPayload({ comments }) {
    const result = comments
      .filter((comment) => !comment.comment)
      .map((comment) => { 
        const replies = this._mappingReplyCommentPayload(comments, comment.id)

        return {
          id: comment.id,
          content: comment.deleted_at ? "**komentar telah dihapus**" : comment.content,
          username: comment.username,
          date: comment.date,
          replies: [...replies]
        }
      })

    return result
  }

  _mappingReplyCommentPayload(replyComments, commentId) {
    const result = replyComments
      .filter((reply) => {
        return reply.comment == commentId
      })
      .map((reply) => ({
        id: reply.id,
        content: reply.deleted_at ? "**balasan telah dihapus**" : reply.content,
        username: reply.username,
        date: reply.date
      }))
    
    return result
  }
}

module.exports = DetailComment