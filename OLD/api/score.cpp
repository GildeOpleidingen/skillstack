#include <nlohmann/json.hpp>
#include <iostream>
#include "include/db.h"
#include "include/utils.h"

using json = nlohmann::json;

int handle_score(sqlite3* db, int user_id) {
  nlohmann::json results = nlohmann::json::array();

      // user_id|score|max_score|percentage_score
      // 4552322|45|130|34.62
      // Get the score.. done / sum of all exercises
      const char* sql = "SELECT user_id, score, max_score, percentage_score FROM user_score_percentages WHERE user_id=?;";      
      sqlite3_stmt* stmt = nullptr;

      if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
          std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
          send_json_error(500, "Failed to prepare statement");
          close_db(db);
          return 0;
      }

      // Bind parameters
      sqlite3_bind_int(stmt, 1, user_id);
      
      while (sqlite3_step(stmt) == SQLITE_ROW) {
        sqlite3_int64 uid     = sqlite3_column_int64 (stmt, 0);
        int           earned  = sqlite3_column_int   (stmt, 1);  // was column 1
        int           maximum = sqlite3_column_int   (stmt, 2);  // was column 2
        double        pct     = sqlite3_column_double(stmt, 3);  // was column 3

        results.push_back({
            {"user_id",   uid},          // let nlohmann handle numeric → JSON
            {"score",     earned},
            {"max_score", maximum},
            {"percentage",pct}
        });
      }
      sqlite3_finalize(stmt); 
      close_db(db);

      std::cout << "Content-Type: application/json\r\n\r\n";
      std::cout << results.dump();
  return 0;
}
