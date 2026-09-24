#include <string>
#include <iostream>
#include <sqlite3.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

#include "include/db.h"
#include "include/utils.h"

int handle_category(sqlite3* db, int user_id) {
    json types = json::array();
    json categories = json::array();

    sqlite3_stmt* stmt = nullptr;

    // --- 1. Fetch types user has selected ---
    const char* sqlTypes = R"(
        SELECT DISTINCT t.id, t.name, t.icon 
            FROM types t 
        JOIN user_selected_types ut ON ut.type_id = t.id 
        WHERE ut.github_id = ? 
        ORDER BY t.sort_id;)";

    if (sqlite3_prepare_v2(db, sqlTypes, -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement (types): " << sqlite3_errmsg(db) << std::endl;
        send_json_error(500, "Failed to fetch types");
        close_db(db);
        return 0;
    }

    sqlite3_bind_int(stmt, 1, user_id);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        sqlite3_int64 id   = sqlite3_column_int64(stmt, 0);
        const unsigned char* nameText = sqlite3_column_text(stmt, 1);
        std::string name = nameText ? reinterpret_cast<const char*>(nameText) : "";

        const unsigned char* iconText = sqlite3_column_text(stmt, 2);
        std::string icon = iconText ? reinterpret_cast<const char*>(iconText) : "";

        types.push_back({
            {"id", id},
            {"name", name},
            {"icon", icon}
        });
    }
    sqlite3_finalize(stmt);

    // --- 2. Fetch categories within those types ---
    const char* sqlCats =
      R"(SELECT c.id, c.name, c.icon, COALESCE(c.parent_id, 0), c.type_id 
      FROM exercise_categories c 
      JOIN user_selected_types ut ON ut.type_id = c.type_id 
      WHERE ut.github_id = ? 
      ORDER BY c.sort_id;)";

    if (sqlite3_prepare_v2(db, sqlCats, -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement (categories): " << sqlite3_errmsg(db) << std::endl;
        send_json_error(500, "Failed to fetch categories");
        close_db(db);
        return 0;
    }

    sqlite3_bind_int(stmt, 1, user_id);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        sqlite3_int64 id   = sqlite3_column_int64(stmt, 0);
        const unsigned char* nameText = sqlite3_column_text(stmt, 1);
        std::string name = nameText ? reinterpret_cast<const char*>(nameText) : "";

        const unsigned char* iconText = sqlite3_column_text(stmt, 2);
        std::string icon = iconText ? reinterpret_cast<const char*>(iconText) : "";

        sqlite3_int64 parent_id = sqlite3_column_int64(stmt, 3);
        sqlite3_int64 type_id   = sqlite3_column_int64(stmt, 4);

        categories.push_back({
            {"id", id},
            {"name", name},
            {"icon", icon},
            {"parent_id", parent_id},
            {"type_id", type_id}
        });
    }
    sqlite3_finalize(stmt);

    close_db(db);

    // --- 3. Build final JSON ---
    json response = {
        {"types", types},
        {"categories", categories}
    };

    std::cout << "Status: 200 OK\r\n";
    std::cout << "Content-Type: application/json\r\n\r\n";
    std::cout << response.dump();
    return 0;
}
