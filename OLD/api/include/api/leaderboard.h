// include/api/leaderboard.h
#pragma once

#include <sqlite3.h>

// Declare the handler for the /api/leaderboard route
void handle_leaderboard(sqlite3* db, int user_id);
