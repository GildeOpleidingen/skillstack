// include/api/submit.h
#pragma once

#include <sqlite3.h>
#include <fcgiapp.h>  // ✅ Add this to make FCGX_Request known

// Declare the handler for the /api/submit route
int handle_submit(sqlite3* db, int user_id, FCGX_Request *request);