// routes/user.cpp
#include <iostream>
#include <nlohmann/json.hpp>
#include <sqlite3.h>
#include "include/utils.h"
#include "include/config.h"

using json = nlohmann::json;

void handle_user(sqlite3* db, int user_id) {
    json results = json::array();

    const char* sql = "SELECT u.github_id, u.github_username, "
                            "u.full_name, u.email, u.avatar_url, u.company, u.location, r.name as role "
                       " FROM users as u " 
                       " LEFT JOIN user_roles as ur ON u.github_id=ur.user_github_id "
                       " LEFT JOIN roles as r ON r.id=ur.role_id "
                       " WHERE github_id=? LIMIT 1;";
    sqlite3_stmt* stmt = nullptr;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
        send_json_error(500, "Failed to prepare statement");
        return;
    }

    sqlite3_bind_int(stmt, 1, user_id);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        sqlite3_int64 github_id = sqlite3_column_int64(stmt, 0);
        std::string username = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)) ?: "";
        std::string full_name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)) ?: "";
        std::string email = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3)) ?: "";
        std::string avatar_url = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4)) ?: "";
        std::string company = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 5)) ?: "";
        std::string location = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 6)) ?: "";
        std::string role = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 7)) ?: "";

        results.push_back({
            {"user_id", std::to_string(github_id)},
            {"username", username},
            {"full_name", full_name},
            {"email", email},
            {"avatar_url", avatar_url},
            {"company", company},
            {"location", location},
            {"role", role}
        });
    }

    sqlite3_finalize(stmt);

    json response = results.size() == 1 ? results[0] : results;

    std::cout << "Content-Type: application/json\r\n\r\n";
    std::cout << response.dump();
} 

// Select the types (like python) of languages
// Select the types (like python) of languages
void get_user_selected_types(sqlite3* db, int user_id) {
    json results = json::array();

    const char* sql =
      "SELECT ut.github_id, t.id AS type_id, t.name AS type_name, ut.selected_at "
      "FROM user_selected_types ut "
      "JOIN types t ON ut.type_id = t.id "
      "WHERE ut.github_id = ?;";

    sqlite3_stmt* stmt = nullptr;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
        send_json_error(500, "Failed to prepare statement");
        return;
    }

    sqlite3_bind_int(stmt, 1, user_id);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        sqlite3_int64 github_id = sqlite3_column_int64(stmt, 0);
        int type_id = sqlite3_column_int(stmt, 1);
        std::string type_name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)) ?: "";
        std::string selected_at = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3)) ?: "";

        results.push_back({
            {"user_id", std::to_string(github_id)},
            {"type_id", type_id},
            {"type_name", type_name},
            {"selected_at", selected_at}
        });
    }

    sqlite3_finalize(stmt);

    json response = results.size() == 1 ? results[0] : results;

    std::cout << "Content-Type: application/json\r\n\r\n";
    std::cout << response.dump();
}


void save_user_selected_types(sqlite3* db, int user_id, char* body) {
    LOG("user#: " + std::to_string(user_id) + " save languages selected");
    // {"languages":["python","c++","nodejs"]}
    json languages_json = json::parse(body);

    // Start transaction
    char* errMsg = nullptr;
    sqlite3_exec(db, "BEGIN TRANSACTION;", nullptr, nullptr, &errMsg);

    // Step 1: Delete previous selections
    {
        const char* delete_sql = "DELETE FROM user_selected_types WHERE github_id = ?;";
        sqlite3_stmt* stmt;
        sqlite3_prepare_v2(db, delete_sql, -1, &stmt, nullptr);
        sqlite3_bind_int(stmt, 1, user_id);
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }

    // Step 2: Insert new selections
    {
        // Prepare statement to lookup type_id from types table
        const char* select_type_sql = "SELECT id FROM types WHERE LOWER(name) = LOWER(?);";
        sqlite3_stmt* select_stmt;
        sqlite3_prepare_v2(db, select_type_sql, -1, &select_stmt, nullptr);

        // Prepare insert
        const char* insert_sql = "INSERT INTO user_selected_types (github_id, type_id) VALUES (?, ?);";
        sqlite3_stmt* insert_stmt;
        sqlite3_prepare_v2(db, insert_sql, -1, &insert_stmt, nullptr);

        for (const auto& lang : languages_json["languages"]) {
            std::string language = lang.get<std::string>();

            // Lookup type_id
            sqlite3_reset(select_stmt);
            sqlite3_bind_text(select_stmt, 1, language.c_str(), -1, SQLITE_TRANSIENT);

            int type_id = -1;
            if (sqlite3_step(select_stmt) == SQLITE_ROW) {
                type_id = sqlite3_column_int(select_stmt, 0);
            }
            sqlite3_reset(select_stmt);

            if (type_id > 0) {
                // Insert into user_selected_types
                sqlite3_bind_int(insert_stmt, 1, user_id);
                sqlite3_bind_int(insert_stmt, 2, type_id);

                sqlite3_step(insert_stmt);
                sqlite3_reset(insert_stmt);
            } else {
                LOG_ERR("Unknown language: " + language);
            }
        }

        sqlite3_finalize(select_stmt);
        sqlite3_finalize(insert_stmt);
    }

    // Commit transaction
    int rc = sqlite3_exec(db, "COMMIT;", nullptr, nullptr, &errMsg);

    if (rc != SQLITE_OK) {
        LOG_ERR(std::string("SQLite COMMIT failed: ") + (errMsg ? errMsg : "Unknown error"));
        sqlite3_free(errMsg);
        std::cout << "Content-Type: application/json\r\n\r\n";
        std::cout << R"({"status":"error"})";
    } else {
        LOG("Transaction committed successfully.");
        std::cout << "Content-Type: application/json\r\n\r\n";
        std::cout << R"({"status":"ok"})";
    }
}


bool get_user_with_roles(sqlite3* db, const std::string& sid,
                         std::string& username,
                         int& user_id,
                         std::vector<std::string>& roles) {
    const char* sql =
        R"(SELECT u.github_id, u.github_username, r.name 
        FROM sessions s 
        JOIN users u ON u.github_username = s.username 
        LEFT JOIN user_roles ur ON ur.user_github_id = u.github_id 
        LEFT JOIN roles r ON r.id = ur.role_id 
        WHERE s.session_id = ?;)";

    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        return false;
    }

    if (sqlite3_bind_text(stmt, 1, sid.c_str(), -1, SQLITE_TRANSIENT) != SQLITE_OK) {
        sqlite3_finalize(stmt);
        return false;
    }

    bool found = false;
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        if (!found) {
            user_id = sqlite3_column_int(stmt, 0);
            username = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
            found = true;
        }
        const unsigned char* role = sqlite3_column_text(stmt, 2);
        if (role) {
            roles.emplace_back(reinterpret_cast<const char*>(role));
        }
    }

    sqlite3_finalize(stmt);
    return found;
}


