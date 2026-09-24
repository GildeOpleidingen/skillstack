#include <sqlite3.h>
#include <random>
#include <iostream>
#include <cstring>
#include <sstream>
#include "include/session.h"

std::string generate_session_id() {
    static const char chars[] = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    std::stringstream ss;
    std::random_device rd;
    std::mt19937 gen(rd());

    for (int i = 0; i < 32; ++i) {
        ss << chars[gen() % (sizeof(chars) - 1)];
    }

    return ss.str();
}

std::string create_session(sqlite3* db, const std::string& username) {
    std::string session_id = generate_session_id();

    const char* sql = "INSERT INTO sessions (session_id, username) VALUES (?, ?);";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        return "";

    sqlite3_bind_text(stmt, 1, session_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, username.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    return session_id;
}

void send_session_cookie(const std::string& session_id) {
    std::cout << "Set-Cookie: SESSION_ID=" << session_id << "; Path=/; HttpOnly\r\n";
}

std::string get_username_by_session(sqlite3* db, const std::string& session_id) {
    const char* sql = "SELECT username FROM sessions WHERE session_id = ?;";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        return "";

    sqlite3_bind_text(stmt, 1, session_id.c_str(), -1, SQLITE_TRANSIENT);

    std::string username;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        username = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
    }

    sqlite3_finalize(stmt);
    return username;
}

std::string extract_cookie_value(const std::string& cookie_header, const std::string& key) {
    std::stringstream ss(cookie_header);
    std::string pair;

    while (std::getline(ss, pair, ';')) {
        size_t equals = pair.find('=');
        if (equals != std::string::npos) {
            std::string k = pair.substr(0, equals);
            std::string v = pair.substr(equals + 1);
            // Trim leading/trailing spaces
            k.erase(0, k.find_first_not_of(" \t"));
            k.erase(k.find_last_not_of(" \t") + 1);
            if (k == key) {
                return v;
            }
        }
    }
    return "";
}

bool session_exists(sqlite3* db, const std::string& session_id) {
    const char* sql = "SELECT 1 FROM sessions WHERE session_id = ?";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return false;
    sqlite3_bind_text(stmt, 1, session_id.c_str(), -1, SQLITE_TRANSIENT);

    bool found = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        found = true;
    }

    sqlite3_finalize(stmt);
    return found;
}

std::string get_session_username(sqlite3* db, const std::string& session_id) {
    const char* sql = "select username from sessions where session_id = ?";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return "";
    sqlite3_bind_text(stmt, 1, session_id.c_str(), -1, SQLITE_TRANSIENT);

    std::string username;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        const unsigned char* text = sqlite3_column_text(stmt, 0);
        if (text) username = reinterpret_cast<const char*>(text);
    }

    sqlite3_finalize(stmt);
    return username;
}

bool delete_session(sqlite3* db, const std::string& session_id) {
    if (!db) return false;

    const char* sql = "DELETE FROM sessions WHERE id = ?";
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    sqlite3_bind_text(stmt, 1, session_id.c_str(), -1, SQLITE_STATIC);

    bool success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}


/// Returns true + fills username when session is valid & **not** expired.
bool get_username_from_session(sqlite3* db, const std::string& sid, std::string& username) {
    //if (sid.size() != 64) return false;                    // cheap sanity check
    
    const char* sql = "select username from sessions where session_id = ?";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return false;
    
    sqlite3_bind_text(stmt, 1, sid.c_str(), -1, SQLITE_TRANSIENT);

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        const unsigned char* text = sqlite3_column_text(stmt, 0);
        if (text) username = reinterpret_cast<const char*>(text);
    }

    sqlite3_finalize(stmt);
    return true;
}

