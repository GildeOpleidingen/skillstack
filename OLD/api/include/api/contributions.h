#include <iostream>
#include <sqlite3.h>
#include <nlohmann/json.hpp>
#include "../db.h"
#include "../utils.h"
#include "../config.h"

int handle_contributions(sqlite3 *db,int user_id);