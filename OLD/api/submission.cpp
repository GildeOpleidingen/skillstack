#include <nlohmann/json.hpp>
#include <string>
#include <iostream>
#include "include/db.h"
#include "include/utils.h"

using json = nlohmann::json;

int handle_submission(sqlite3* db, int user_id, std::string query) {
  // Get ex_id (exercise id) from url
  int ex_id = get_id_from_query("ex_id=", query);
  //int ex_id = 0;//std::stoi(extract_query_param(getenv("QUERY_STRING") ?: "", "ex_id"));
  if (ex_id <= 0) {
      send_json_error(401, "Missing or invalid exercise ID");
      close_db(db);
      return 0;
  }

  nlohmann::json submissions = nlohmann::json::array();

  // Prepare statement to fetch submissions
  const char* sql = "SELECT id, user_id, exercise_id, result, score, submitted_at, graded_at, graded, submitted_code "
                    " FROM submissions WHERE user_id=? AND exercise_id=? ORDER BY submitted_at DESC";
  sqlite3_stmt* stmt = nullptr;

  if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
      std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
      send_json_error(500, "Failed to prepare statement");
      close_db(db);
      return 0;
  }

  // Bind parameters
  sqlite3_bind_int(stmt, 1, user_id);
  sqlite3_bind_int(stmt, 2, ex_id);

  while (sqlite3_step(stmt) == SQLITE_ROW) {
    // id|user_id|exercise_id|submitted_code|result|score|submitted_at|graded_at|graded
    int id = sqlite3_column_int(stmt, 0);
    int user_id = sqlite3_column_int(stmt, 1);
    int exercide_id = sqlite3_column_int(stmt, 2);
    std::string r = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
    int score = sqlite3_column_int(stmt, 4);
    std::string submitted_at = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 5));
    const char* rawG = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 6));
    std::string graded_at = rawG ? rawG : "";
    int graded = sqlite3_column_int(stmt, 7);
    const char* rawC = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 8));
    std::string code = rawC ? rawC : ""; 

    submissions.push_back({
        {"id", std::to_string(id)},
        {"user_id", std::to_string(user_id)},
        {"exercise_id", std::to_string(exercide_id)},
        {"result", r},
        {"score", std::to_string(score)},
        {"submitted_at", submitted_at},
        {"graded_at", graded_at},
        {"graded", std::to_string(graded)},
        {"code", code}
    });
  }
  sqlite3_finalize(stmt); 
  close_db(db);

  std::cout << "Content-Type: application/json\r\n\r\n";
  std::cout << submissions.dump();
  return 0;
}
