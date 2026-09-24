#pragma once
#include <string>
#include <fcgiapp.h>
#include "db.h"
#include "config.h"

void handle_upload(sqlite3* db, int user_id, FCGX_Request* request);