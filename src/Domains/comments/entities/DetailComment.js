class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload)

    const comments = this._mappingPayload(payload)

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

  _mappingPayload({ comments }) {
    return comments.map((comment) => ({
      id: comment.id,
      content: comment.deleted_at ? "**komentar telah dihapus**" : comment.content,
      username: comment.username,
      date: comment.date
    }))
  }
}

module.exports = DetailComment