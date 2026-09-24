#include <string>
#include <sstream>
#include <iostream>
#include <regex>
#include <fstream>
#include <nlohmann/json.hpp>
#include <unordered_map>
#include <fcgiapp.h>
#include <fcgi_stdio.h>
#include <bits/stdc++.h>
#include <sqlite3.h>
#include <sstream>
#include <curl/curl.h>
#include <fcgiapp.h>

#include "include/fcgi_streambuf.h"
#include "include/utils.h"

using json = nlohmann::json;

void send_json_error(int status_code, const std::string &msg)
{
    static const std::unordered_map<int, std::string> reason = {
        {400, "Form error"}, {401, "Unauthorized"}, {403, "Forbidden"}, {500, "error"}};
    std::cout << "Status: " << status_code << ' ' << reason.at(status_code) << "\r\n"
              << "Content-Type: application/json\r\n"
              << "Cache-Control: no-store\r\n\r\n"
              << nlohmann::json{{"error", msg}}.dump();
}

std::string extract_query_param(const std::string &query, const std::string &key)
{
    std::string prefix = key + "=";
    size_t start = query.find(prefix);
    if (start == std::string::npos)
        return "";
    start += prefix.length();
    size_t end = query.find('&', start);
    if (end == std::string::npos)
        end = query.length();
    return query.substr(start, end - start);
}

std::string extract_username_from_json(const std::string &user_json_str)
{
    try
    {
        auto j = json::parse(user_json_str);
        if (j.contains("login") && j["login"].is_string())
            return j["login"].get<std::string>();
    }
    catch (...)
    {
        // handle parse errors if needed
    }
    return "";
}

/**
 Function to render html from a template file
 */
std::string render_template(const std::string &page_name, const std::map<std::string, std::string> &context)
{
    std::filesystem::path base_dir = std::filesystem::current_path(); // or fs::path("/your/base/path") for production
    std::filesystem::path full_path = base_dir / "templates" / page_name;
    std::ifstream file(full_path.string());
    if (!file.is_open())
    {
        std::cerr << "[ERROR] Failed to open template: " << full_path.string() << std::endl;
        std::cerr << "[ERROR] Current working directory: " << std::filesystem::current_path() << std::endl;
        return "<p>Error loading template.</p>";
    }

    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string html = buffer.str();

    for (const auto &[key, value] : context)
    {
        std::regex placeholder("\\{\\{" + key + "\\}\\}");
        html = std::regex_replace(html, placeholder, value);
    }

    return html;
}

/* -----------------------------------------------------------------------
 *  render_login_page()
 */
void render_login_page()
{
    std::map<std::string, std::string> context = {
        {"title", "Login"},
        {"message", "Welcome to CodeFolio"}};
    std::cout << render_template("login.html", context);
}

// std::string read_stdin() {
//     std::string input;
//     std::string line;
//     while (std::getline(std::cin, line)) {
//         input += line + "\n";
//     }
//     return input;
// }

// URL decode helper
std::string url_decode(const std::string &str)
{
    std::string result;
    char ch;
    int i, ii;
    for (i = 0; i < str.length(); i++)
    {
        if (int(str[i]) == int('%'))
        {
            sscanf(str.substr(i + 1, 2).c_str(), "%x", &ii);
            ch = static_cast<char>(ii);
            result += ch;
            i = i + 2;
        }
        else if (str[i] == '+')
        {
            result += ' ';
        }
        else
        {
            result += str[i];
        }
    }
    return result;
}

std::unordered_map<std::string, std::string> parse_form_data(const std::string &data)
{
    std::unordered_map<std::string, std::string> result;
    std::istringstream stream(data);
    std::string pair;

    while (std::getline(stream, pair, '&'))
    {
        size_t pos = pair.find('=');
        if (pos != std::string::npos)
        {
            std::string key = url_decode(pair.substr(0, pos));
            std::string value = url_decode(pair.substr(pos + 1));
            result[key] = value;
        }
    }

    return result;
}

int get_id_from_query(std::string key, std::string query)
{
    // const char* queryStr = getenv("QUERY_STRING"); // "category_id=3"
    // std::string query = queryStr ? queryStr : "";

    int id = 0;
    size_t pos = query.find(key);
    if (pos != std::string::npos)
    {
        std::string value = query.substr(pos + key.length());
        size_t amp = value.find("&");
        if (amp != std::string::npos)
        {
            value = value.substr(0, amp);
        }
        try
        {
            id = std::stoi(value);
        }
        catch (...)
        {
            id = -1;
        }
    }
    return id;
}

// To read the form data from a request
std::string read_stdin(FCGX_Request *request)
{
    const char *clen = FCGX_GetParam("CONTENT_LENGTH", request->envp);
    int len = clen ? atoi(clen) : 0;
    std::string body;

    if (len > 0)
    {
        char *buffer = new char[len + 1];
        FCGX_GetStr(buffer, len, request->in);
        buffer[len] = '\0';
        body.assign(buffer);
        delete[] buffer;
    }

    return body;
}

/**
 Function to load config file config.env to get github client_id etc...
 */
std::unordered_map<std::string, std::string> load_config(const std::string &filename)
{
    std::unordered_map<std::string, std::string> configM;
    std::ifstream file(filename);
    std::string line;

    while (std::getline(file, line))
    {
        if (line.empty() || line[0] == '#')
            continue; // skip comments
        size_t delimiter = line.find('=');
        if (delimiter == std::string::npos)
            continue;

        std::string key = line.substr(0, delimiter);
        std::string value = line.substr(delimiter + 1);

        auto ltrim = [](std::string &s)
        { s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch)
                                          { return !std::isspace(ch); })); };
        auto rtrim = [](std::string &s)
        { s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch)
                               { return !std::isspace(ch); })
                      .base(),
                  s.end()); };
        auto trim = [&](std::string &s)
        { ltrim(s); rtrim(s); };

        trim(key);
        trim(value);
        // Remove trailing CR if file had Windows CRLF
        if (!value.empty() && value.back() == '\r')
            value.pop_back();
        // Strip surrounding quotes if present
        if (value.size() >= 2 && ((value.front() == '"' && value.back() == '"') ||
                                  (value.front() == '\'' && value.back() == '\'')))
        {
            value = value.substr(1, value.size() - 2);
        }

        if (!key.empty())
            configM[key] = value;
    }
    return configM;
}