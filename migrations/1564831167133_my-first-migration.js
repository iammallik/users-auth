exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("ausers", {
      id: { type: "serial"},
      name: { type: "varchar(100)", notNull: true, unique: true },
      password: { type: "varchar(300)", notNull: true },
      email: { type: "varchar(50)", notNull: true, unique: true },
      about: { type: "text" },
      createdAt: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("current_timestamp")
      }
    });
  };
