exports.up = (pgm) => {
  pgm.createTable("comment_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true
    },
    comment: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  })

  pgm.addConstraint(
    "comment_likes",
    "fk_comment_likes.comment_comments.id",
    "FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE"
  )
  pgm.addConstraint(
    "comment_likes",
    "fk_comment_likes.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  )
}

exports.down = (pgm) => {
  pgm.dropTable("comment_likes")
}
