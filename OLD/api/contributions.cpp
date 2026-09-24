#include "include/api/contributions.h"
#include <string>
#include <ctime>
#include "include/config.h"

/* SHOULD return
{
  "summary": {
    "total": 4653,
    "year": 322,
    "month": 3,
    "streak": {
      "max": 26,
      "year": 11,
      "month": 1
    }
  },
  "days": {
    "2025-08-06": 3,
    "2025-08-03": 1,
    "2025-07-15": 2,
    ...
  }
}

*/

int handle_contributions(sqlite3 *db, int user_id) {
    nlohmann::json results = nlohmann::json::object();

    // Step 1: Generate all dates in last 30 days with 0 count
    std::time_t now = std::time(nullptr);
    for (int i = 0; i <= 150; ++i) {
        std::time_t t = now - i * 24 * 60 * 60;
        std::tm* tm_ptr = std::localtime(&t);
        char date_buf[11]; // YYYY-MM-DD + \0
        std::strftime(date_buf, sizeof(date_buf), "%Y-%m-%d", tm_ptr);
        results[date_buf] = 0;
    }

    // Step 2: Query actual submissions in that range
    const char* sql = "SELECT DATE(submitted_at) AS day, COUNT(*) AS count "
                      " FROM submissions "
                      " WHERE user_id = ? "
                      " AND DATE(submitted_at) BETWEEN DATE('now', '-150 days') AND DATE('now') "
                      //"AND submitted_at BETWEEN DATE('now', '-150 days') AND DATE('now') "
                      " AND result='Accepted' GROUP BY day;";

    // LOG("sql: SELECT DATE(submitted_at) AS day, COUNT(*) AS count FROM submissions "
    //     "WHERE user_id =" + std::to_string(user_id) +
    //     " AND DATE(submitted_at) BETWEEN DATE('now', '-150 days') AND DATE('now')"
    //     " AND result='Accepted' GROUP BY day;"
    // );

    sqlite3_stmt* stmt = nullptr;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        LOG_ERR("Failed to prepare statement: " + std::string(sqlite3_errmsg(db)));
        send_json_error(500, "Failed to prepare statement");
        close_db(db);
        return 0;
    }

    sqlite3_bind_int(stmt, 1, user_id);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        const char* date = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
        int count = sqlite3_column_int(stmt, 1);
        results[date] = count;
    }

    sqlite3_finalize(stmt);
    close_db(db);

    // Output the JSON response
    std::cout << "Status: 200 OK\r\n";
    std::cout << "Content-Type: application/json\r\n\r\n";
    std::cout << results.dump();

    return 0;
}
