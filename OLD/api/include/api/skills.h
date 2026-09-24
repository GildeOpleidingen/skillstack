/* api/include/api/skills.h */
#pragma once

#include <sqlite3.h>

// Declare the handler for the /api/leaderboard route
void handle_skills(sqlite3* db, int user_id);
