// include/api/category.h
#pragma once

#include <sqlite3.h>

// Declare the handler for the /api/user route
int handle_category(sqlite3* db, int user_id);
