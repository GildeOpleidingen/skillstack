// main.cpp
#include <cstring>
#include <iostream>
#include <string>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <fcgiapp.h>
#include <fcgi_stdio.h>
#include <sqlite3.h>
#include <curl/curl.h>
#include <fcgiapp.h>
#include <streambuf>

#include "include/db.h"
#include "include/session.h"
#include "include/utils.h"
#include "include/fcgi_streambuf.h"
#include "include/github_login.h"
#include "include/api/user.h"
#include "include/api/category.h"
#include "include/api/task.h"
#include "include/api/score.h"
#include "include/api/leaderboard.h"
#include "include/api/submission.h"
#include "include/api/exercise.h"
#include "include/api/submit.h"
#include "include/api/contributions.h"
#include "include/api/skills.h"
#include "include/upload.h"

using json = nlohmann::json;
using namespace std;

void handleRequest(FCGX_Request *request)
{

    // TODO put the endpoints in an Array

    // Call your handler with extracted env vars
    // Get request path and cookies
    // const char* path_cstr = FCGX_GetParam("PATH_INFO", request->envp);
    // std::string path = path_cstr ? path_cstr : "";
    const char *query_cstr = FCGX_GetParam("QUERY_STRING", request->envp);
    std::string query = query_cstr ? query_cstr : "";
    const char *full_uri_cstr = FCGX_GetParam("REQUEST_URI", request->envp);
    std::string full_uri = full_uri_cstr ? full_uri_cstr : "";
    // Split at '?'
    std::string path = full_uri;
    std::size_t pos = full_uri.find('?');
    if (pos != std::string::npos)
    {
        path = full_uri.substr(0, pos); // everything before '?'
    }

    // Optional: get query string
    // std::string query_string = (pos != std::string::npos) ? full_uri.substr(pos + 1) : "";
    const char *cookie_cstr = FCGX_GetParam("HTTP_COOKIE", request->envp);
    const std::string cookie = cookie_cstr ? cookie_cstr : "";

    // SOME TEST CODE
    // cout << "Status: 200 OK\r\n" << "Content-Type: text/html\r\n\r\n";
    // cout << "Test\n";
    // return;

    // Get cookie session_id from cookie
    string sid = extract_cookie_value(cookie, "session_id");

    // Open DB (and later when finished close it)
    sqlite3 *db = open_db();
    if (!db)
    {
        cout << "Status: 500 Internal Server Error\r\n"
             << "Content-Type: text/plain\r\n\r\n"
             << "Database connection failed";
        return;
    }

    string username;
    // TODO somehow session_valid always 1???
    // bool session_valid = get_username_from_session(db, sid, username);
    // int user_id = session_valid ? get_user_id(db, username) : -1;
    int user_id = -1;
    std::vector<std::string> roles;

    bool session_valid = get_user_with_roles(db, sid, username, user_id, roles);

    // DEBUGGING session valid, uncomment when debugging
    // cout << "Status: 200 OK\r\n"
    //              << "Content-Type: text/html\r\n\r\n";
    //         cout << " session_valid: " << session_valid << "\n";
    //         cout << " user_id: " << user_id << "\n";
    // return;

    // log
    std::ostringstream log;
    log << "Session valid: " << session_valid
        << " User#: " << user_id
        << " Roles: [";
    for (size_t i = 0; i < roles.size(); ++i)
    {
        log << roles[i];
        if (i + 1 < roles.size())
            log << ", ";
    }
    log << "]";
    LOG(log.str());

    if (path == "/api/logout")
    {
        if (!sid.empty())
        {
            delete_session(db, sid);
        }
        cout << "Status: 302 Found\r\n"
             << "Set-Cookie: session_id=deleted; Path=/; Max-Age=0; HttpOnly\r\n"
             << "Location: /\r\n\r\n";
        close_db(db);
        return;
    }

    if (path == "/login/github")
    {
        string redirect = "https://github.com/login/oauth/authorize"
                          "?client_id=" +
                          CLIENT_ID +
                          "&redirect_uri=" + CLIENT_REDIRECT_URL +
                          "&scope=read:user";
        cout << "Status: 302 Found\r\n"
             << "Content-Type: text/html\r\n"
             << "Location: " << redirect << "\r\n\r\n"
             << "<html><body>Redirecting to GitHub...</body></html>";
        close_db(db);
        return;
    }

    if (path == "/auth/github/callback")
    {
        string code = extract_query_param(query, "code");
        if (code.empty())
        {
            cout << "Status: 400 Bad Request\r\n"
                 << "Content-Type: text/html\r\n\r\n"
                 << "<p>Error: Missing OAuth code.</p>";
            close_db(db);
            return;
        }

        string access_token = github_exchange_code_for_token(code);
        if (access_token.empty())
        {
            cout << "Status: 500 Internal Server Error\r\n"
                 << "Content-Type: text/html\r\n\r\n"
                 << "<p>Error: Failed to get access token.</p>";
            close_db(db);
            return;
        }

        string user_json_str = github_get_user_info(access_token);
        if (user_json_str.empty())
        {
            cout << "Status: 500 Internal Server Error\r\n"
                 << "Content-Type: text/html\r\n\r\n"
                 << "<p>Error: Failed to fetch user info.</p>";
            close_db(db);
            return;
        }

        json user_json = json::parse(user_json_str);
        string github_username = user_json.value("login", "");

        if (!insert_user_from_json(db, user_json))
        {
            cout << "Status: 500 Internal Server Error\r\n"
                 << "Content-Type: text/html\r\n\r\n"
                 << "<p>Error: Failed to save user.</p>";
            close_db(db);
            return;
        }

        string session_id = create_session(db, github_username);
        if (!session_id.empty())
        {
            bool secure_cookie = false;
            // Use Secure cookies only when redirect URL is HTTPS (prod)
            try {
                secure_cookie = CLIENT_REDIRECT_URL.rfind("https://", 0) == 0;
            } catch (...) { secure_cookie = false; }

            cout << "Status: 302 Found\r\n"
                 << "Content-Type: text/html\r\n"
                 << "Set-Cookie: session_id=" << session_id
                 << "; Path=/; HttpOnly; SameSite=Lax" << (secure_cookie ? "; Secure" : "") << "\r\n"
                 << "Location: /dashboard\r\n\r\n"
                 << "<html><body>Redirecting...</body></html>";
        }
        else
        {
            cout << "Status: 500 Internal Server Error\r\n"
                 << "Content-Type: text/html\r\n\r\n"
                 << "<p>Error: Could not create sessionId.</p>";
        }

        close_db(db);
        return;
    }

    // Some security for the API endpoints
    if (!session_valid && path.rfind("/api/", 0) == 0)
    {
        cout << "Status: 401 Unauthorized\r\n"
             << "Content-Type: application/json\r\n\r\n"
             << R"({"error": "Unauthorized"})";
        close_db(db);
        return;
    }

    // Get method
    const char *method = FCGX_GetParam("REQUEST_METHOD", request->envp);
    // Get content type like: application/json
    // const char* content_type = FCGX_GetParam("CONTENT_TYPE", request->envp);
    // Get content length
    const char *content_length_str = FCGX_GetParam("CONTENT_LENGTH", request->envp);
    int content_length = content_length_str ? atoi(content_length_str) : 0;

    // API Routing
    if (path == "/api/user")
    {
        handle_user(db, user_id);
    }
    else if (path == "/api/user_selected_types")
    {
        if (method && strcmp(method, "POST") == 0)
        {
            if (content_length > 0)
            {
                char *body = (char *)malloc(content_length + 1);
                FCGX_GetStr(body, content_length, request->in);
                body[content_length] = '\0'; // Null-terminate
                save_user_selected_types(db, user_id, body);
                free(body);
            }
        }
        else
        {
            get_user_selected_types(db, user_id);
        }
    }
    else if (path == "/api/categories")
    {
        handle_category(db, user_id);
    }
    else if (path == "/api/tasks")
    {
        handle_task(db, user_id);
    }
    else if (path == "/api/score")
    {
        handle_score(db, user_id);
    }
    else if (path == "/api/leaderboard")
    {
        handle_leaderboard(db, user_id);
    }
    else if (path == "/api/submissions")
    {
        handle_submission(db, user_id, query);
    }
    else if (path.rfind("/api/exercise", 0) == 0)
    {

        if (method && strcmp(method, "POST") == 0 &&
            (has_role(roles, "admin") || has_role(roles, "teacher")))
        {
            if (content_length > 0)
            {
                char *body = (char *)malloc(content_length + 1);
                FCGX_GetStr(body, content_length, request->in);
                body[content_length] = '\0';

                LOG("Post exercise");
                handle_add_exercise(db, user_id, std::string(body));

                free(body);
            }
            else
            {
                send_json_error(400, "Missing body for POST");
            }
        }
        if (method && strcmp(method, "PUT") == 0 &&
            (has_role(roles, "admin") || has_role(roles, "teacher")))
        {
            if (content_length > 0)
            {
                char *body = (char *)malloc(content_length + 1);
                FCGX_GetStr(body, content_length, request->in);
                body[content_length] = '\0';

                LOG("Update exercise");
                handle_update_exercise(db, user_id, std::string(body));

                free(body);
            }
            else
            {
                send_json_error(400, "Missing body for PUT");
            }
        }
        else
        {
            handle_exercise(db, user_id, query);
        }
    }
    else if (path == "/api/submit")
    {
        handle_submit(db, user_id, request);
    }
    else if (path == "/api/contributions")
    {
        handle_contributions(db, user_id);
    }
    else if (path == "/api/skills")
    {
        handle_skills(db, user_id);
    }
    else if (path == "/api/upload")
    {
        if (method && strcmp(method, "POST") == 0)
        {
            handle_upload(db, user_id, request);
        }
        else
        {
            send_json_error(405, "Method Not Allowed");
        }
    }
    else
    {
        // Return JSON error instead of HTML redirect
        cout << "Status: 404 Not Found\r\n"
             << "Content-Type: application/json\r\n\r\n"
             << R"({"error": "Endpoint not found"})";
    }

    close_db(db);
}

// WORKING!
// void handleRequest(FCGX_Request* request) {
//     const char* uri_cstr = FCGX_GetParam("REQUEST_URI", request->envp);
//     std::string uri = uri_cstr ? uri_cstr : "";

//     std::cout << "Status: 200 OK\r\n"
//               << "Content-Type: text/plain\r\n\r\n";
//     std::cout << "Hello from FastCGI using C++ iostream!\n";
//     std::cout << "REQUEST_URI: " << uri << "\n";
// }

int main()
{
    FCGX_Init();
    FCGX_Request request;

    int sock = FCGX_OpenSocket("127.0.0.1:9000", 1024);
    if (sock < 0)
    {
        LOG_ERR("Failed to open FastCGI socket at 127.0.0.1:9000\n");
        return 1;
    }
    FCGX_InitRequest(&request, sock, 0);
    LOG("Started FastCGI socket at 127.0.0.1:9000");

    while (FCGX_Accept_r(&request) >= 0)
    {
        fcgi_streambuf cin_fcgi_buf(request.in);
        fcgi_streambuf cout_fcgi_buf(request.out);

        // Redirect std streams
        std::streambuf *cin_backup = std::cin.rdbuf();
        std::streambuf *cout_backup = std::cout.rdbuf();

        std::cin.rdbuf(&cin_fcgi_buf);
        std::cout.rdbuf(&cout_fcgi_buf);

        handleRequest(&request);

        // Restore streams
        std::cin.rdbuf(cin_backup);
        std::cout.rdbuf(cout_backup);

        FCGX_Finish_r(&request);
    }

    return 0;
}
