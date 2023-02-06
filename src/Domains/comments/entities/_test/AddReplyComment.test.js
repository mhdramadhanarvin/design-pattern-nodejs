const AddReplyComment = require("../AddReplyComment")

describe("a AddReplyComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new AddReplyComment(payload)).toThrowError("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
  })

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: "Comment biasa",
      thread: {},
      owner: "user-123",
      comment: "comment-123",
    }

    // Action and Assert
    expect(() => new AddReplyComment(payload)).toThrowError("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
  })

  it("should create AddReplyComment object correctly", () => {
    // Arrange
    const payload = {
      content: "Comment biasa",
      thread: "thread-123",
      owner: "user-123",
      comment: "comment-123",
    }

    // Action
    const addReplyComment = new AddReplyComment(payload)

    // Assert 
    expect(addReplyComment.content).toEqual(payload.content)
    expect(addReplyComment.thread).toEqual(payload.thread)
    expect(addReplyComment.owner).toEqual(payload.owner)
    expect(addReplyComment.comment).toEqual(payload.comment)
  })
})