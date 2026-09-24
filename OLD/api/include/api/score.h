// include/api/score.h
#pragma once

#include <sqlite3.h>

// Declare the handler for the /api/score route
void handle_score(sqlite3* db, int user_id);
