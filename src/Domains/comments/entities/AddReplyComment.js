class AddReplyComment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { content, thread, owner, comment } = payload

    this.content = content
    this.thread = thread
    this.owner = owner
    this.comment = comment
  }

  _verifyPayload({ content, thread, owner, comment }) {
    if (!content || !thread || !owner) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
    }

    if (typeof content !== "string" || typeof thread !== "string" || typeof owner !== "string" || typeof comment !== "string") {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
    } 
  }
}

module.exports = AddReplyComment