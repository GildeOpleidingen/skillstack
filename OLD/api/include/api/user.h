// include/api/user.h
#pragma once

#include <algorithm>
#include <sqlite3.h>
#include <string>
#include <vector>

// Declare the handler for the /api/user route
void handle_user(sqlite3* db, int user_id);

// Get user language types selected
void get_user_selected_types(sqlite3* db, int user_id);

// Save user selection
void save_user_selected_types(sqlite3* db, int user_id, char* body);

bool get_user_with_roles(sqlite3* db, const std::string& sid,
                         std::string& username,
                         int& user_id,
                         std::vector<std::string>& roles);

/* 
  Helper function to check users role
  Usage :
  if (has_role(roles, "admin")) {
      // allow access
  }
*/
inline bool has_role(const std::vector<std::string>& roles, const std::string& role) {
    return std::find(roles.begin(), roles.end(), role) != roles.end();
}                         
