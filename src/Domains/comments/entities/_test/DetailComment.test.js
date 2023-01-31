const DetailComment = require("../DetailComment")

describe("a DetailComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
  })

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      comments: "comment-123"
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
  })

  it("should create DetailComment object correctly", () => {
    // Arrange
    const payload = {
      comments: [
        {
          id: "comment-1",
          content: "comment 1",
          username: "user1",
          date: "2023-01-23 16:41:20.532",
          replies: []
        }
      ]
    }

    // Action
    const { comments } = new DetailComment(payload)

    // Assert
    expect(comments).toEqual(payload.comments) 
  })

  it("should mapping DetailComment object correctly", () => {
    // Arrange
    const payload = {
      comments: [
        {
          id: "comment-1",
          content: "comment 1",
          username: "user1",
          date: "2023-01-23 16:41:20.532",
          deleted_at: "2023-01-25 16:41:20.532"
        },
        {
          id: "comment-2",
          content: "comment 2",
          username: "user1",
          date: "2023-01-23 16:41:20.532", 
        },
      ]
    }

    // Action
    const { comments } = new DetailComment(payload)

    // Assert
    const expectedReturn = [
      {
        id: "comment-1",
        content: "**komentar telah dihapus**",
        username: "user1",
        date: "2023-01-23 16:41:20.532", 
        replies: []
      },
      {
        id: "comment-2",
        content: "comment 2",
        username: "user1",
        date: "2023-01-23 16:41:20.532", 
        replies: []
      },
    ]
    expect(comments).toEqual(expectedReturn) 
  })
})