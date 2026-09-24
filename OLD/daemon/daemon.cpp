#include <algorithm>
#include <iomanip>
#include <iostream>
#include <cstdlib>
#include <vector>
#include <chrono>
#include <thread>
#include <sqlite3.h>
#include <ctime>
#include <string>
#include "../api/include/grade.h"
#include "../api/include/db.h" // helpers: open_db(), load_tests(), etc.

namespace fs = std::filesystem;

// trim helpers
static inline void ltrim(std::string &s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](int ch) { return !std::isspace(ch); }));
}
static inline void rtrim(std::string &s) {
    s.erase(std::find_if(s.rbegin(), s.rend(), [](int ch) { return !std::isspace(ch); }).base(), s.end());
}
static inline std::string trim(const std::string &s) {
    std::string r = s; ltrim(r); rtrim(r); return r;
}

struct Test { int id; std::string in, exp; int pts; };


std::vector<Test> load_tests(sqlite3* db, int ex_id) {
    std::vector<Test> v;
    sqlite3_stmt* st = nullptr;
    const char* sql =
        "SELECT id, content FROM exercise_blocks "
        "WHERE exercise_id=? AND block_type='test' "
        "ORDER BY sort_order ASC";

    if (sqlite3_prepare_v2(db, sql, -1, &st, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(st, 1, ex_id);
        while (sqlite3_step(st) == SQLITE_ROW) {
            int id = sqlite3_column_int(st, 0);
            const unsigned char* content_text = sqlite3_column_text(st, 1);
            std::string content = content_text ? reinterpret_cast<const char*>(content_text) : "";

            std::string input, expected;
            std::size_t pos = content.find("|||");
            if (pos != std::string::npos) {
                input = content.substr(0, pos);
                expected = content.substr(pos + 3);
            } else {
                input = "";
                expected = content;
            }

            auto trim = [](std::string& s) {
                size_t start = s.find_first_not_of(" \t\r\n");
                size_t end = s.find_last_not_of(" \t\r\n");
                if (start == std::string::npos) { s.clear(); return; }
                s = s.substr(start, end - start + 1);
            };
            trim(input);
            trim(expected);

            v.push_back({id, input, expected, 1});
        }
    }

    sqlite3_finalize(st);
    return v;
}



void grade_one(sqlite3* db, int sub_id, int ex_id, const std::string& code, const std::string& type) {
    auto tests = load_tests(db, ex_id);
    int total_pts = 0, score = 0;
    for (auto& t: tests) total_pts += t.pts;

    std::string verdict = "Accepted";
    std::string compiler_output, compile_error, test_error, test_res;
    std::string prog = "/tmp/sub_" + std::to_string(sub_id);

   if (type == "NodeJS") {
        // No separate compile step for NodeJS
        for (size_t i=0; i<tests.size(); ++i) {
            auto& tc = tests[i];
            std::string run_out, run_err;
            bool ok = run_nodejs_docker(code, tc.in, run_out, run_err);
            if (!ok) { verdict = "Runtime/Timeout"; break; }
            if (trim(run_out) == trim(tc.exp)) score += tc.pts;
            else {
                verdict = "Wrong answer (test #" + std::to_string(i+1) + ")";
                test_error = run_err;
                test_res = run_out;
                break;
            }
        }
    } else if (type == "C++") {
        bool compile_ok = compile_cpp_docker(code, prog, compiler_output, compile_error);
        if (!compile_ok) { verdict = "Compilation error"; compiler_output = compile_error; }
        else {
            for (size_t i=0; i<tests.size(); ++i) {
                auto& tc = tests[i];
                std::string run_out, run_err;
                bool ok = run_cpp_docker(prog, tc.in, run_out, run_err);
                if (!ok) { verdict = "Runtime/Timeout"; break; }
                if (trim(run_out) == trim(tc.exp)) score += tc.pts;
                else { verdict = "Wrong answer (test #" + std::to_string(i+1) + ")"; test_error = run_err; test_res = run_out; break; }
            }
        }
    } else {
        verdict = "NOT IMPLEMENTED";
    }

    if (verdict == "Accepted") score = total_pts;

    auto now = std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
    std::cout << std::put_time(std::localtime(&now), "%Y-%m-%d %H:%M:%S")
              << " verdict: " << verdict << " sub_id: " << sub_id << std::endl;

    // Update DB
    sqlite3_stmt* st;
    const char* upd = "UPDATE submissions SET result=?, score=?, graded=1, graded_at=CURRENT_TIMESTAMP, compile_res=?, error_message=? WHERE id=?";
    if (sqlite3_prepare_v2(db, upd, -1, &st, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << std::endl;
        return;
    }
    sqlite3_bind_text(st, 1, verdict.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(st, 2, score);
    sqlite3_bind_text(st, 3, compiler_output.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(st, 4, test_error.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(st, 5, sub_id);
    if (sqlite3_step(st) != SQLITE_DONE) {
        std::cerr << "Failed to execute update: " << sqlite3_errmsg(db) << std::endl;
    }
    sqlite3_finalize(st);
}

int main() {
    std::cout << "[Grader] started\n";

    while (true) {
        sqlite3* db = open_db();
        sqlite3_stmt* st;
        const char* sql = "SELECT id, exercise_id, submitted_code, type_name, user_id, graded FROM v_submissions WHERE graded=0 LIMIT 10";

        if (sqlite3_prepare_v2(db, sql, -1, &st, nullptr) != SQLITE_OK) {
            std::cerr << "SQL prepare failed: " << sqlite3_errmsg(db) << "\n";
            close_db(db);
            std::this_thread::sleep_for(std::chrono::seconds(3));
            continue;
        }

        bool any = false;
        while (sqlite3_step(st) == SQLITE_ROW) {
            any = true;
            int sub_id = sqlite3_column_int(st,0);
            int ex_id  = sqlite3_column_int(st,1);
            const unsigned char* code_ptr = sqlite3_column_text(st,2);
            const unsigned char* type_ptr = sqlite3_column_text(st,3);
            std::string code = code_ptr ? reinterpret_cast<const char*>(code_ptr) : "";
            std::string type = type_ptr ? reinterpret_cast<const char*>(type_ptr) : "";

            std::cout << "[Grader] processing sub_id: " << sub_id << " ex_id: " << ex_id << " type: " << type << "\n";
            grade_one(db, sub_id, ex_id, code, type);
        }

        sqlite3_finalize(st);
        close_db(db);

        if (!any) std::this_thread::sleep_for(std::chrono::seconds(3));
    }

    return 0;
}
