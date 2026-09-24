#include <nlohmann/json.hpp>
#include <sqlite3.h>
#include <string>
#include <iostream>
#include "include/db.h"
#include "include/utils.h"
#include "include/config.h"
#include "include/api/exercise.h"

using json = nlohmann::json;

bool load_exercise_blocks(sqlite3* db, int ex_id, json& blocks_out) {
    std::string query = 
        "SELECT block_type, content, sort_order "
        "FROM exercise_blocks WHERE exercise_id = ? ORDER BY sort_order ASC";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
        return false;
    }

    sqlite3_bind_int(stmt, 1, ex_id);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        std::string block_type = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
        std::string content    = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        int sort_order         = sqlite3_column_int(stmt, 2);

        blocks_out.push_back({
            {"block_type", block_type},
            {"content", content},
            {"sort_order", sort_order}
        });
    }

    sqlite3_finalize(stmt);
    return true;
}

int handle_get_exercises(sqlite3* db, int user_id, int category_id) {
  
  if (category_id < 0) {
    send_json_error(400, "Missing or invalid category");
    return 0;
  }

  nlohmann::json exercises = nlohmann::json::array();
  const char* sql = R"(SELECT e.id, e.title, e.description, 
                         COALESCE(s.status, 'unsubmitted') AS status, 
                         max_score , sub_id, e.is_active 
                       FROM exercises e 
                       LEFT JOIN ( 
                             SELECT exercise_id, MIN(result) AS status 
                             FROM submissions  
                             WHERE user_id = ? 
                             GROUP BY exercise_id 
                        ) s ON e.id = s.exercise_id WHERE e.category_id = ?;)";

    sqlite3_stmt* st{};
    sqlite3_prepare_v2(db, sql, -1, &st, nullptr);

    sqlite3_bind_int(st, 1, user_id);
    sqlite3_bind_int(st, 2, category_id);

    while (sqlite3_step(st) == SQLITE_ROW) {
        int id = sqlite3_column_int(st,0);
        auto col1 = sqlite3_column_text(st,1);
        auto col2 = sqlite3_column_text(st,2);
        auto col3 = sqlite3_column_text(st,3);

        std::string t = col1 ? reinterpret_cast<const char*>(col1) : "";
        std::string d = col2 ? reinterpret_cast<const char*>(col2) : "";
        std::string s = col3 ? reinterpret_cast<const char*>(col3) : "";
        int pts = sqlite3_column_int(st,4);
        int sub_id = sqlite3_column_int(st,5);
        int is_active = sqlite3_column_int(st, 6);

        exercises.push_back({
            {"id", std::to_string(id)},
            {"title", t},
            {"description", d},
            {"status", s},
            {"score", pts},
            {"sub_id", std::to_string(sub_id)},
            {"is_active", is_active}
        });
    }
    sqlite3_finalize(st); close_db(db);

    std::cout << "Content-Type: application/json\r\n\r\n";
    std::cout << exercises.dump();
    return 0;
}


int handle_get_exercise(sqlite3* db, int user_id, int ex_id) {
    std::string title, input, expected;

    int maxScore, is_active, sub_id;
    std::vector<ExerciseBlock> blocks;
    if (!load_exercise(db, ex_id, title, input, expected, maxScore, is_active, blocks, sub_id)) {
        json err = { {"error", "No such exercise"} };
        std::cout << "Status: 404 Not Found\r\n"
                  << "Content-Type: application/json\r\n\r\n"
                  << err.dump();
        return 0;
    }

    // Load blocks
    json blocks_json = json::array();
    load_exercise_blocks(db, ex_id, blocks_json);

    // Build response
    json res = {
        {"id", ex_id},
        {"title", title},
        {"input", input}, 
        {"expected", expected},
        {"score", maxScore},
        {"blocks", blocks_json},
        {"is_active", is_active},
        {"sub_id", sub_id}
    };
    LOG(res.dump());
    std::cout << "Content-Type: application/json\r\n\r\n";
    std::cout << res.dump();
    return 0;
}


int handle_exercise(sqlite3* db, int user_id, std::string query) {
  int category_id = get_id_from_query("category_id=", query);
  int ex_id = get_id_from_query("id=", query);
  // std::cout << "Status: 200 OK\r\n" << "Content-Type: text/html\r\n\r\n";
  // std::cout << category_id;
  // send_json_error(400, query);
  if (category_id < 0 && ex_id < 0) {
    send_json_error(400,  "Missing category_id or ex_id");
    return 0;
  }

  if(category_id > 0) {
    return handle_get_exercises(db, user_id, category_id);
  }
  if(ex_id > 0) {
    return handle_get_exercise(db, user_id, ex_id);
  }
  return 0;
}


int handle_add_exercise(sqlite3* db, int user_id, const std::string& body) {
    try {
        auto j = json::parse(body);
        std::string title = j.value("title", "");
        int category_id = 0;
        if (j.contains("category_id")) {
            if (j["category_id"].is_string()) {
                category_id = std::stoi(j["category_id"].get<std::string>());
            } else {
                category_id = j["category_id"].get<int>();
            }
        }

        const char* sql = "INSERT INTO exercises (title, category_id, is_active) VALUES (?, ?, 0)";
        sqlite3_stmt* stmt;

        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
            sqlite3_bind_int(stmt, 2, category_id);
            sqlite3_step(stmt);
        }
        sqlite3_finalize(stmt);

        int new_id = (int) sqlite3_last_insert_rowid(db);

        std::cout << "Status: 200 OK\r\n"
                  << "Content-Type: application/json\r\n\r\n"
                  << "{ \"id\": " << new_id << ", \"title\": \"" << title 
                  << "\", \"category_id\": " << category_id << " }";

        return 1;
    } catch (std::exception& e) {
        send_json_error(400, e.what());
        return 0;
    }
}


// Save or update an exercise (PUT or POST)
int handle_update_exercise(sqlite3* db, int user_id, const std::string& body) {
    try {
        auto j = json::parse(body);

        int ex_id = std::stoi(j["id"].get<std::string>());

        // --- If request only toggles visibility ---
        if (j.contains("is_active")) {
            int is_active = j["is_active"].get<int>();

            const char* sql = "UPDATE exercises SET is_active = ? WHERE id = ?";
            sqlite3_stmt* stmt;
            if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
                sqlite3_bind_int(stmt, 1, is_active);
                sqlite3_bind_int(stmt, 2, ex_id);
                sqlite3_step(stmt);
            }
            sqlite3_finalize(stmt);

            std::cout << "Status: 200 OK\r\n"
                      << "Content-Type: application/json\r\n\r\n"
                      << R"({"success": true, "updated": "is_active"})";
            return 1;
        }

        // --- Full update path (title, description, blocks) ---
        std::string title = j.value("title", "");
        std::string description = j.value("description", "");

        const char* update_sql =
            "UPDATE exercises SET title = ?, description = ? WHERE id = ?";
        sqlite3_stmt* stmt;
        if (sqlite3_prepare_v2(db, update_sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
            sqlite3_bind_text(stmt, 2, description.c_str(), -1, SQLITE_TRANSIENT);
            sqlite3_bind_int(stmt, 3, ex_id);
            sqlite3_step(stmt);
        }
        sqlite3_finalize(stmt);

        // --- Delete old blocks ---
        const char* delete_sql = "DELETE FROM exercise_blocks WHERE exercise_id = ?";
        if (sqlite3_prepare_v2(db, delete_sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_int(stmt, 1, ex_id);
            sqlite3_step(stmt);
        }
        sqlite3_finalize(stmt);

        // --- Insert new blocks ---
        const char* insert_sql =
            "INSERT INTO exercise_blocks (exercise_id, block_type, content, sort_order) "
            "VALUES (?, ?, ?, ?)";
        if (sqlite3_prepare_v2(db, insert_sql, -1, &stmt, nullptr) == SQLITE_OK) {
            for (auto& block : j["blocks"]) {
                std::string block_type = block.value("block_type", "text");
                std::string content    = block.value("content", "");
                int sort_order         = block.value("sort_order", 0);

                sqlite3_bind_int(stmt, 1, ex_id);
                sqlite3_bind_text(stmt, 2, block_type.c_str(), -1, SQLITE_TRANSIENT);
                sqlite3_bind_text(stmt, 3, content.c_str(), -1, SQLITE_TRANSIENT);
                sqlite3_bind_int(stmt, 4, sort_order);

                sqlite3_step(stmt);
                sqlite3_reset(stmt);
            }
        }
        sqlite3_finalize(stmt);

        // --- Respond success ---
        std::cout << "Status: 200 OK\r\n"
                  << "Content-Type: application/json\r\n\r\n"
                  << R"({"success": true, "updated": "full"})";

        return 1;

    } catch (std::exception& e) {
        send_json_error(400, e.what());
        return 0;
    }
}