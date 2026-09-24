// include/api/exercise.h
#pragma once

#include <sqlite3.h>
#include <string>


int handle_get_exercises(sqlite3* db, int user_id, int category_id);
int handle_get_exercise(sqlite3* db, int user_id, int ex_id);

// Declare the handler for the /api/user route
int handle_exercise(sqlite3* db, int user_id, std::string query);

int handle_add_exercise(sqlite3* db, int user_id, const std::string& body);

int handle_update_exercise(sqlite3* db, int user_id, const std::string& body);