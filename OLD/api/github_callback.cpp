#include <iostream>
#include <sqlite3.h>
#include "utils.h"
#include <iostream>
#include <cstdlib>
#include <string>
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include "include/db.h"
#include "include/github_login.h"
#include "include/config.h"

using namespace std;
using json = nlohmann::json;


string get_query_param(const string& query, const string& key) {
    size_t pos = query.find(key + "=");
    if (pos == string::npos) return "";
    size_t end = query.find("&", pos);
    return query.substr(pos + key.size() + 1, end - pos - key.size() - 1);
}

static size_t write_callback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

string http_post(const string& url, const string& data, const string& headers = "") {
    CURL* curl = curl_easy_init();
    string response;

    if (curl) {
        struct curl_slist* chunk = nullptr;
        if (!headers.empty())
            chunk = curl_slist_append(chunk, headers.c_str());

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());
        if (chunk)
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, chunk);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    }

    return response;
}


string http_get(const string& url, const string& access_token) {
    CURL* curl = curl_easy_init();
    string response;

    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, ("Authorization: token " + access_token).c_str());
        headers = curl_slist_append(headers, "User-Agent: rayit-cpp-app");

        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, +[](char* ptr, size_t size, size_t nmemb, void* userdata) -> size_t {
            ((string*)userdata)->append(ptr, size * nmemb);
            return size * nmemb;
        });

        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        curl_easy_perform(curl);

        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }

    return response;
}

std::string github_exchange_code_for_token(const std::string& code) {
    
    CURL* curl = curl_easy_init();
    std::string response;

    if (!curl) return "";

    std::string post_fields = "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + code;

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Accept: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, "https://github.com/login/oauth/access_token");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_fields.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    CURLcode res = curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) return "";

    try {
        auto json_resp = json::parse(response);
        if (json_resp.contains("access_token")) {
            return json_resp["access_token"].get<std::string>();
        }
    } catch (...) {
        // ignore parse errors
    }

    return "";
}

std::string github_get_user_info(const std::string& access_token) {
    CURL* curl = curl_easy_init();
    std::string response;

    if (!curl) return "";

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, ("Authorization: token " + access_token).c_str());
    headers = curl_slist_append(headers, "User-Agent: rayit-cpp-app");

    curl_easy_setopt(curl, CURLOPT_URL, "https://api.github.com/user");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    CURLcode res = curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) return "";

    return response;
}

// Insert user into SQLITE3
bool insert_user_from_json(sqlite3* db, const json& user_json)
{
    // sqlite3* db = nullptr;
    int rc = sqlite3_open(DB_PATH.c_str(), &db);
    if (rc != SQLITE_OK) {
        std::cerr << "[SQLite] open error: " << sqlite3_errmsg(db) << '\n';
        return false;
    }

    const char* sql =
        "INSERT OR REPLACE INTO users "
        "(github_username, full_name, email, avatar_url, company, location, "
        " blog, github_id, created_at, updated_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
/*
    const char* sql =
	"INSERT OR REPLACE INTO users "
	"(github_username, full_name) "
	"VALUES (?, ?);";
*/
    sqlite3_stmt* stmt = nullptr;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "[SQLite] prepare error: " << sqlite3_errmsg(db) << '\n';
        sqlite3_close(db);
        return false;
    }

      // SAFER string getter
    auto safe_string = [](const json& j, const char* key) -> std::string {
        return (j.is_object() && j.contains(key) && j[key].is_string())
           ? j[key].get<std::string>()
           : "";
    };

   int github_id = (user_json.is_object() &&
                 user_json.contains("id")   &&
                 user_json["id"].is_number_integer())
                ? user_json["id"].get<int>()
                : 0;
    // Pull into variables to keep .c_str() valid
    std::string login      = safe_string(user_json, "login");
    std::string name       = safe_string(user_json, "name");
    std::string email      = safe_string(user_json, "email");
    std::string avatar     = safe_string(user_json, "avatar_url");
    std::string company    = safe_string(user_json, "company");
    std::string location   = safe_string(user_json, "location");
    std::string blog       = safe_string(user_json, "blog");
    std::string created_at = safe_string(user_json, "created_at");
    std::string updated_at = safe_string(user_json, "updated_at");
    // int github_id          = user_json.value("id", 0);

    LOG("login: " + safe_string(user_json, "login") + ", email: " + 
            safe_string(user_json, "email") +
            ", id: "    + std::to_string(github_id)
        );

    // Bind all values safely
    sqlite3_bind_text(stmt,  1, login.c_str(),      -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  2, name.c_str(),       -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  3, email.c_str(),      -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  4, avatar.c_str(),     -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  5, company.c_str(),    -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  6, location.c_str(),   -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt,  7, blog.c_str(),       -1, SQLITE_TRANSIENT);
    sqlite3_bind_int (stmt,  8, github_id);
    sqlite3_bind_text(stmt,  9, created_at.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 10, updated_at.c_str(), -1, SQLITE_TRANSIENT);


    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        std::cerr << "[SQLite] step error: " << sqlite3_errmsg(db) << '\n';
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
    return rc == SQLITE_DONE;
}


// int main() {
//     std::string qs = getenv("QUERY_STRING") ?: "";
//     std::string code = extract_query_param(qs, "code");
//     if (code.empty()) {
//         std::cout << "Content-Type: text/html\r\n\r\n"
//                   << "<p>Error: missing code.</p>";
//         return 1;
//     }

//     std::string token = github_exchange_code_for_token(code);
//     std::string user_json = github_get_user_info(token);

//     sqlite3* db = open_db();
//     insert_user_from_json(db, user_json);
//     std::string username = extract_username_from_json(user_json);

//     std::string session_id = create_session(db, username);
//     close_db(db);

//     std::cout << "Status: 302 Found\r\n"
//               << "Set-Cookie: session_id=" << session_id << "; Path=/; HttpOnly; Secure\r\n"
//               << "Location: /dashboard\r\n\r\n";
//     return 0;
// }
