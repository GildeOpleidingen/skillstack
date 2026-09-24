#ifndef GITHUB_LOGIN_H
#define GITHUB_LOGIN_H

#include <string>
#include <sqlite3.h>
#include <nlohmann/json.hpp>
#include "utils.h"



std::string github_exchange_code_for_token(const std::string& code);

std::string github_get_user_info(const std::string& access_token);

#endif // GITHUB_LOGIN_H

