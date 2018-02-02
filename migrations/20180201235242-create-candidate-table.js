
exports.up = function (db) {
  return db.runSql(`
    CREATE TABLE candidate
    (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      test_date DATETIME NOT NULL DEFAULT NOW(),
      first_name VARCHAR(50),
      last_name VARCHAR(50)
    )
    ENGINE = InnoDB
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `)
}

exports.down = function (db) {
    return db.runSql(`
    DROP TABLE candidate
  `)
}
