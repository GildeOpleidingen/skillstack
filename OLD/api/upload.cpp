#include <fcgiapp.h>
#include <fstream>
#include <sstream>
#include <filesystem>
#include <nlohmann/json.hpp>
#include "include/upload.h"
#include "include/db.h"
#include "include/config.h"
#include "include/utils.h"

using json = nlohmann::json;
namespace fs = std::filesystem;

void handle_upload(sqlite3* db, int user_id, FCGX_Request* request) {
    char* content_type = getenv("CONTENT_TYPE");
    char* content_length_str = getenv("CONTENT_LENGTH");

    if (!content_type || !strstr(content_type, "multipart/form-data")) {
        send_json_error(400, "Invalid content type (must be multipart/form-data)");
        return;
    }

    int content_length = content_length_str ? atoi(content_length_str) : 0;
    if (content_length <= 0) {
        send_json_error(400, "Empty upload");
        return;
    }

    // Read raw body
    std::vector<char> body(content_length);
    FCGX_GetStr(body.data(), content_length, request->in);

    // 🔥 NOTE: Parsing multipart is tricky. For demo we’ll just assume one file.
    std::string data(body.begin(), body.end());

    // Extract file content (very naive parser, for production use a real multipart parser)
    std::string boundary = content_type;
    boundary = boundary.substr(boundary.find("boundary=") + 9);
    std::string delimiter = "--" + boundary;

    size_t fileStart = data.find("\r\n\r\n") + 4;
    size_t fileEnd = data.rfind(delimiter) - 4; // trim trailing \r\n

    std::string fileData = data.substr(fileStart, fileEnd - fileStart);

    // Save to /uploads/{user_id}/
    fs::create_directories("uploads/" + std::to_string(user_id));
    std::string filename = "uploads/" + std::to_string(user_id) + "/file_" + std::to_string(time(nullptr)) + ".bin";

    std::ofstream out(filename, std::ios::binary);
    out.write(fileData.c_str(), fileData.size());
    out.close();

    // Insert metadata into DB
    std::string url = "/" + filename;
    const char* sql = "INSERT INTO media (user_id, type, url) VALUES (?, ?, ?)";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, user_id);
        sqlite3_bind_text(stmt, 2, "image", -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 3, url.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }

    // Return JSON
    json res = { {"url", url} };
    out << "Content-Type: application/json\r\n\r\n" << res.dump();
}
