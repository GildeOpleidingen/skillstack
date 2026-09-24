// db.cpp
#include <sqlite3.h>
#include <iostream>
#include <string>
#include <nlohmann/json.hpp>
#include "include/db.h"
#include "include/config.h"

using json = nlohmann::json;




sqlite3* open_db() {
    sqlite3* db = nullptr;
    int rc = sqlite3_open(DB_PATH.c_str(), &db);
    if (rc != SQLITE_OK) {
        std::cerr << "[SQLite] open error: " << sqlite3_errmsg(db) << '\n';
        sqlite3_close(db);
        return nullptr;
    }
    return db;
}

void close_db(sqlite3* db) {
    if (db) {
        sqlite3_close(db);
    }
}

bool insert_user_from_json(sqlite3* db, const std::string& user_json_str) {
    if (!db) return false;

    json user_json;
    try {
        user_json = json::parse(user_json_str);
    } catch (const json::parse_error& e) {
        std::cerr << "JSON parse error: " << e.what() << '\n';
        return false;
    }

    const char* sql =
        "INSERT OR REPLACE INTO users "
        "(github_username, full_name, email, avatar_url, company, location, "
        " blog, github_id, created_at, updated_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

    sqlite3_stmt* stmt = nullptr;
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "[SQLite] prepare error: " << sqlite3_errmsg(db) << '\n';
        return false;
    }

    auto safe_string = [](const json& j, const char* key) -> std::string {
        return (j.is_object() && j.contains(key) && j[key].is_string())
            ? j[key].get<std::string>()
            : "";
    };

    int github_id = (user_json.is_object() &&
                     user_json.contains("id") &&
                     user_json["id"].is_number_integer())
                    ? user_json["id"].get<int>()
                    : 0;

    std::string login = safe_string(user_json, "login");
    std::string name = safe_string(user_json, "name");
    std::string email = safe_string(user_json, "email");
    std::string avatar = safe_string(user_json, "avatar_url");
    std::string company = safe_string(user_json, "company");
    std::string location = safe_string(user_json, "location");
    std::string blog = safe_string(user_json, "blog");
    std::string created_at = safe_string(user_json, "created_at");
    std::string updated_at = safe_string(user_json, "updated_at");

    sqlite3_bind_text(stmt,  1, login.c_str(),      -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  2, name.c_str(),       -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  3, email.c_str(),      -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  4, avatar.c_str(),     -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  5, company.c_str(),    -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  6, location.c_str(),   -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  7, blog.c_str(),       -1, SQLITE_TRANSIENT);
    sqlite3_bind_int (stmt,  8, github_id);
    sqlite3_bind_text(stmt,  9, created_at.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 10, updated_at.c_str(), -1, SQLITE_TRANSIENT);

    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        std::cerr << "[SQLite] step error: " << sqlite3_errmsg(db) << '\n';
        sqlite3_finalize(stmt);
        return false;
    }

    sqlite3_finalize(stmt);
    return true;
}

inline std::string safe_column_text(sqlite3_stmt* stmt, int col) {
    const unsigned char* text = sqlite3_column_text(stmt, col);
    return text ? reinterpret_cast<const char*>(text) : "";
}

bool load_exercise(sqlite3* db,
                   int ex_id,
                   std::string& title,
                   std::string& input,
                   std::string& expected_output,
                   int& max_score,
                   int& is_active,
                   std::vector<ExerciseBlock>& blocks,
                    int& sub_id) 
{
    // Step 1: load metadata
    std::string meta_query = R"(
        SELECT title, input, expected_output, max_score, is_active, sub_id
        FROM exercises 
        WHERE id = ?
    )";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db, meta_query.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
        return false;
    }

    sqlite3_bind_int(stmt, 1, ex_id);

    bool found = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        auto col0 = sqlite3_column_text(stmt, 0);
        auto col1 = sqlite3_column_text(stmt, 1);
        auto col2 = sqlite3_column_text(stmt, 2);

        title           = col0 ? reinterpret_cast<const char*>(col0) : "";
        input           = col1 ? reinterpret_cast<const char*>(col1) : "";
        expected_output = col2 ? reinterpret_cast<const char*>(col2) : "";
        max_score       = sqlite3_column_int(stmt, 3);
        is_active       = sqlite3_column_int(stmt, 4);
        sub_id          = sqlite3_column_int(stmt, 5);
        found = true;
    }
    sqlite3_finalize(stmt);
    if (!found) return false;

    // Step 2: load blocks
    std::string block_query = R"(
        SELECT block_type, content, sort_order
        FROM exercise_blocks 
        WHERE exercise_id = ? 
        ORDER BY sort_order ASC
    )";
    sqlite3_stmt* stmt_block;
    if (sqlite3_prepare_v2(db, block_query.c_str(), -1, &stmt_block, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
        return false;
    }
    sqlite3_bind_int(stmt_block, 1, ex_id);

    while (sqlite3_step(stmt_block) == SQLITE_ROW) {
        ExerciseBlock b;
        //auto type    = sqlite3_column_text(stmt_block, 0);
        //auto content = sqlite3_column_text(stmt_block, 1);

        auto col0 = sqlite3_column_text(stmt, 0);
        auto col1 = sqlite3_column_text(stmt, 1);
        auto col3 = sqlite3_column_int(stmt_block, 2);

        std::string block_type = col0 ? reinterpret_cast<const char*>(col0) : "text";
        std::string content    = col1 ? reinterpret_cast<const char*>(col1) : "";
        int sort_order = col3 ? reinterpret_cast<const int>(col3) : 0;

        b.block_type = block_type;
        b.content    = content;
        b.sort_order = sort_order;

        blocks.push_back(b);
    }
    sqlite3_finalize(stmt_block);
    return true;
}

int get_user_id(sqlite3* db, const std::string& username) {
    sqlite3_stmt* stmt;
    const char* sql = "SELECT github_id FROM users WHERE github_username = ? LIMIT 1";

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        return -1;

    sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_TRANSIENT);

    int user_id = -1;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        user_id = sqlite3_column_int(stmt, 0);
    }

    sqlite3_finalize(stmt);
    return user_id;
}

// Put the submission in database
int log_submission(sqlite3* db,
                             int user_id,
                             int ex_id,
                             const std::string& code,
                             const std::string& result,
                             int score)
{
    LOG("Put submission in DB, user#: " + std::to_string(user_id) + " exercise#:" 
            + std::to_string(ex_id) );
    const char* sql =
        "INSERT INTO submissions "
        "(user_id, exercise_id, submitted_code, result, score) "
        "VALUES (?, ?, ?, ?, ?)";

    LOG("SQL: INSERT INTO submissions "
        "(user_id, exercise_id, submitted_code, result, score) VALUES (" +
        std::to_string(user_id) + ", " +
        std::to_string(ex_id) + ", '" +
        code + "', '" +
        result + "', " +
        std::to_string(score) + ")");
    
    sqlite3_stmt* stmt = nullptr;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        return 0;                         // prepare failed

    sqlite3_bind_int   (stmt, 1, user_id);
    sqlite3_bind_int   (stmt, 2, ex_id);
    sqlite3_bind_text  (stmt, 3, code.c_str(),   -1, SQLITE_TRANSIENT);
    sqlite3_bind_text  (stmt, 4, result.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int   (stmt, 5, score);

 

    if (sqlite3_step(stmt) != SQLITE_DONE) {
        sqlite3_finalize(stmt);
        return 0;                         // insert failed
    }

    sqlite3_int64 rowid = sqlite3_last_insert_rowid(db);  // <-- here
    sqlite3_finalize(stmt);
    return rowid;
}

