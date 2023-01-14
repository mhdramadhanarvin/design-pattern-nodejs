const AddedComment = require("../AddedComment")

describe("a AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
  })

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: {},
      content: "Comment biasa",
      owner: "user-123"
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
  })

  it("should create AddedComment object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      content: "Isinya bebas ajalah",
      owner: "user-123"
    }

    // Action
    const addedComment = new AddedComment(payload)

    // Assert
    expect(addedComment.id).toEqual(payload.id)
    expect(addedComment.content).toEqual(payload.content)
    expect(addedComment.thread).toEqual(payload.thread)
    expect(addedComment.owner).toEqual(payload.owner)
  })
})
