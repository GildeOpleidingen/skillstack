#pragma once
#include <sqlite3.h>
#include <string>
#include <nlohmann/json.hpp>
#include "config.h"

sqlite3* open_db();
void close_db(sqlite3* db);

struct ExerciseBlock {
    std::string type;   // "text" or "test"
    std::string content;
    std::string block_type;
    std::string sort_order;
};

bool insert_user_from_json(sqlite3* db, const nlohmann::json& user_json);


inline std::string safe_column_text(sqlite3_stmt* stmt, int col);

bool load_exercise(sqlite3* db,
                   int ex_id,
                   std::string& title,
                   std::string& input,
                   std::string& expected_output,
                   int& max_score,
                   int& is_active,
                   std::vector<ExerciseBlock>& blocks,
                    int& sub_id);

int get_user_id(sqlite3* db, const std::string& username);

int log_submission(sqlite3* db, int user_id, int ex_id, const std::string& code, const std::string& result, int score);
