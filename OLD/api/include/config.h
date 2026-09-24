#pragma once
#include <string>
#include <unordered_map>
#include <iostream>
#include <chrono>
#include <ctime>
#include <iomanip>

// ANSI escape codes for colors
#define COLOR_RED     "\033[31m"
#define COLOR_RESET   "\033[0m"

#define LOG(msg) \
  do { \
    auto now = std::chrono::system_clock::now(); \
    std::time_t now_c = std::chrono::system_clock::to_time_t(now); \
    std::tm tm = *std::localtime(&now_c); \
    std::cerr << "[" << std::put_time(&tm, "%Y-%m-%d %H:%M:%S") << "] " \
              << __FILE__ << ":" << __LINE__ << " - " << msg << std::endl; \
  } while (0)

#define LOG_ERR(msg) \
  do { \
    auto now = std::chrono::system_clock::now(); \
    std::time_t now_c = std::chrono::system_clock::to_time_t(now); \
    std::tm tm = *std::localtime(&now_c); \
    std::cerr << COLOR_RED \
              << "[" << std::put_time(&tm, "%Y-%m-%d %H:%M:%S") << "] " \
              << __FILE__ << ":" << __LINE__ << " - " << msg \
              << COLOR_RESET << std::endl; \
  } while (0)

// Declare external config and constants
extern std::unordered_map<std::string, std::string> config;

extern const std::string CLIENT_ID;
extern const std::string CLIENT_SECRET;
extern const std::string CLIENT_REDIRECT_URL;
extern const std::string DB_PATH;
