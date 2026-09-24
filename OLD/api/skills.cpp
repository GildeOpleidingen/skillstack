#include <string>
#include <iostream>
#include <sqlite3.h>

#include <nlohmann/json.hpp>  // ✅ Required for nlohmann::json
using json = nlohmann::json;

#include "include/db.h"
#include "include/utils.h"
#include "include/api/skills.h"

void handle_skills(sqlite3* db, int user_id) {
  nlohmann::json results = nlohmann::json::array();
  const char* sql = "select user_id, skill_name, xp, level from v_user_skills;"
                    " WHERE user_id=? ORDER BY skill_name;";      
  sqlite3_stmt* stmt = nullptr;

  if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
      std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
      send_json_error(500, "Failed to prepare statement");
      close_db(db);
      return;
  }

  // Bind parameters
  sqlite3_bind_int(stmt, 1, user_id);
  
  while (sqlite3_step(stmt) == SQLITE_ROW) {
    sqlite3_int64 id     = sqlite3_column_int64 (stmt, 0);
    std::string   skill_name  = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));  // was column 1
    sqlite3_int64 xp = sqlite3_column_int64 (stmt, 2);
    sqlite3_int64 level = sqlite3_column_int64 (stmt, 3);

    results.push_back({
        {"user_id",   std::to_string(id)},          // let nlohmann handle numeric → JSON
        {"skill_name", skill_name},
        {"xp", xp},
        {"level", level}           
    });
  }
  sqlite3_finalize(stmt); 
  close_db(db);
  std::cout << "Status: 200 OK\r\n";
  std::cout << "Content-Type: application/json\r\n\r\n";
  std::cout << results.dump();
  return;
}
