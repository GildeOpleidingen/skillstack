#pragma once
#include <string>
#include <sqlite3.h>

// Create a session sting...
std::string generate_session_id();

// Create a session entry in DB
std::string create_session(sqlite3* db, const std::string& username);

// Helper to send session(store)
void send_session_cookie(const std::string& session_id);

// Get username from DB by session_id
std::string get_username_by_session(sqlite3* db, const std::string& session_id);

// Get a value from a cookie
std::string extract_cookie_value(const std::string& cookie_header, const std::string& key);

// Check if session exists in DB
bool session_exists(sqlite3* db, const std::string& session_id);

// Get session username
std::string get_session_username(sqlite3* db, const std::string& session_id);

// Delete session
bool delete_session(sqlite3* db, const std::string& session_id);

bool get_username_from_session(sqlite3* db, const std::string& sid, std::string& username);
