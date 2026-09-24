#ifndef UTILS_H
#define UTILS_H

#include <string>
#include <map>
#include <unordered_map>
#include <fcgiapp.h>

// Nice json error for the API
void send_json_error(int status_code, const std::string& msg);

// Extract query parameter value from query string, returns empty string if not found
std::string extract_query_param(const std::string& query, const std::string& key);

// Extract username (login) from GitHub user JSON string
std::string extract_username_from_json(const std::string& user_json_str);

// Render a template of the templates folder
std::string render_template(const std::string& filepath, const std::map<std::string, std::string>& context);

// Quick hlper to send the login page
void render_login_page();

// std::string read_stdin();

// Old way not working?
std::unordered_map<std::string, std::string> parse_form_data(const std::string& data);

// To get the id out of a query string ?id=
int get_id_from_query(std::string key, std::string query);

// To read formdata from request
std::string read_stdin(FCGX_Request* request);

std::unordered_map<std::string, std::string> load_config(const std::string& filename);

#endif // UTILS_H
