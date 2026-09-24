#include "include/config.h"
#include "include/utils.h"

std::unordered_map<std::string, std::string> config = load_config("config.env");

const std::string CLIENT_ID = config["CLIENT_ID"];
const std::string CLIENT_SECRET = config["CLIENT_SECRET"];
const std::string CLIENT_REDIRECT_URL = config["CLIENT_REDIRECT_URL"];
const std::string DB_PATH = config["DB_PATH"];
