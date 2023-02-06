exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    thread: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment: {
      type: "VARCHAR(50)",
      defaultValue: null,
      comment: "if value is null it's parent comment, if it contains it's a comment reply"
    },
    likes: {
      type: "integer",
      noNull: true,
      default: 0
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    deleted_at: {
      type: "TIMESTAMP", 
      defaultValue: null,
    }, 
  })

  pgm.addConstraint(
    "comments",
    "fk_comments.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  )
  pgm.addConstraint(
    "comments",
    "fk_comments.thread_threads.id",
    "FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE"
  )
}

exports.down = (pgm) => {
  pgm.dropTable("comments")
}
