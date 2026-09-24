// include/api/submission.h
#pragma once

#include <sqlite3.h>

// Declare the handler for the /api/submissions route
int handle_submission(sqlite3* db, int user_id, std::string query);
