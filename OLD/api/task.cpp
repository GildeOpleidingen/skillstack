#include <nlohmann/json.hpp>
#include <string>
#include <iostream>
#include "include/db.h"
#include "include/utils.h"

using json = nlohmann::json;

int handle_task(sqlite3* db, int user_id) {
   nlohmann::json results = nlohmann::json::array();
      
      // exercise_id|user_id|title|description|category_name|last_score|max_score|status
      const char* sql = "select exercise_id, title,category_id, category_name,"
                        " status from v_action_points_all WHERE user_id=?; ";    
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
      // title, category_name, status 

        sqlite3_int64 exercise_id     = sqlite3_column_int64 (stmt, 0);
        std::string   title  = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));  // was column 1
        int           category_id = sqlite3_column_int(stmt, 2);
        std::string   category_name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));  // was column 2
        std::string   status = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4));  // was column 2
        

        results.push_back({
            {"exercise_id", std::to_string(exercise_id)},
            {"category_id", std::to_string(category_id)},
            {"title",   title},          // let nlohmann handle numeric → JSON
            {"category_name", category_name},
            {"status", status}     
        });
      }
      sqlite3_finalize(stmt); 
      close_db(db);

      std::cout << "Content-Type: application/json\r\n\r\n";
      std::cout << results.dump();
      return 0;
}
