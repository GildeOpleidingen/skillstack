#include <nlohmann/json.hpp>
#include <string>
#include <iostream>
#include "include/db.h"
#include "include/utils.h"

using json = nlohmann::json;

int handle_leaderboard(sqlite3* db, int user_id) {
  
      nlohmann::json results = nlohmann::json::array();
      const char* sql = "SELECT username, avatar_url, total_score, exercises_solved "                    
        " FROM ( "
        "  SELECT * "
        "  FROM ( "
        "    SELECT * "
        "    FROM v_leaderboard "
        "    ORDER BY total_score DESC "
        "    LIMIT 10 "
        "  ) "
        "  UNION "
        "  SELECT * "
        "  FROM v_leaderboard "
        "  WHERE github_id = ? "
        " ) "
        " GROUP BY github_id "
        " ORDER BY total_score DESC;";      
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
      // username | avatar_url| total_score | exercises_solved |

        // sqlite3_int64 id     = sqlite3_column_int64 (stmt, 0);
        std::string   username  = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));  // was column 1
        std::string   avatar_url = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));  // was column 2
        int   total_score = sqlite3_column_int(stmt, 2);
        int   exercises_solved = sqlite3_column_int(stmt, 3);

        results.push_back({
            {"username",   username},          // let nlohmann handle numeric → JSON
            {"avatar_url", avatar_url},
            {"total_score", std::to_string(total_score)},
            {"exercises_solved", std::to_string(exercises_solved)}            
        });
      }
      sqlite3_finalize(stmt); 
      close_db(db);

      std::cout << "Content-Type: application/json\r\n\r\n";
      std::cout << results.dump();
      return 0;
}
