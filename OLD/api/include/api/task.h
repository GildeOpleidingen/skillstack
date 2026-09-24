// include/api/task.h
#pragma once

#include <sqlite3.h>

// Declare the handler for the /api/task route
void handle_task(sqlite3* db, int user_id);
