#include <fstream>
#include <filesystem>
#include <cstdlib>
#include <string>
#include "../api/include/config.h"

namespace fs = std::filesystem;

std::string trim(const std::string& str) {
    const auto strBegin = str.find_first_not_of(" \t\n\r");
    if (strBegin == std::string::npos) return "";
    const auto strEnd = str.find_last_not_of(" \t\n\r");
    return str.substr(strBegin, strEnd - strBegin + 1);
}

bool compile_cpp_docker(const std::string& code, const std::string& out_binary,
                        std::string& compiler_output, std::string& compiler_error) {
    fs::path tmpDir = fs::temp_directory_path() / "cpp_sandbox";
    fs::create_directories(tmpDir);

    fs::path srcFile = tmpDir / "tmp.cpp";
    std::ofstream(srcFile) << code;

   std::string cmd =
    "docker run --rm "
    "--network none "
    "-m 256m "
    "-v " + tmpDir.string() + ":/app "
    "cpp-sandbox "
    "sh -c \"g++ /app/tmp.cpp -std=c++17 -O2 -o /app/prog.out "
    "1>/app/compile.out 2>/app/compile.err\"";

    LOG(cmd);
    int ret = std::system(cmd.c_str());

    std::ifstream outFile(tmpDir / "compile.out");
    compiler_output = std::string((std::istreambuf_iterator<char>(outFile)), std::istreambuf_iterator<char>());

    std::ifstream errFile(tmpDir / "compile.err");
    compiler_error = std::string((std::istreambuf_iterator<char>(errFile)), std::istreambuf_iterator<char>());

    fs::path binFile = tmpDir / "prog.out";
    if (fs::exists(binFile)) {
        fs::copy(binFile, out_binary, fs::copy_options::overwrite_existing);
        return true;
    }
    return false;
}

bool run_cpp_docker(const std::string& bin_path, const std::string& input,
                    std::string& run_out, std::string& run_err) {
    fs::path tmpDir = fs::temp_directory_path() / "cpp_sandbox_run";
    fs::create_directories(tmpDir);

    fs::copy(bin_path, tmpDir / "prog.out", fs::copy_options::overwrite_existing);
    std::ofstream(tmpDir / "input.txt") << input;
    if (!fs::exists(tmpDir / "input.txt")) {
        LOG("input.txt missing before docker run");
    } else {
        LOG("input.txt size = " + std::to_string(fs::file_size(tmpDir / "input.txt")));
    }

    // Fill when empty new line..
    if (input.empty()) {
        std::ofstream(tmpDir / "input.txt") << "\n";
    }

    std::string cmd = 
    "docker run --rm "
    "--network none "
    "-m 256m "
    "-v " + tmpDir.string() + ":/app "
    "cpp-sandbox "
    "sh -c \"/app/prog.out < /app/input.txt > /app/output.txt 2> /app/err.txt\"";

    LOG(cmd);
    int ret = std::system(cmd.c_str());

    std::ifstream outFile(tmpDir / "output.txt");
    run_out = std::string((std::istreambuf_iterator<char>(outFile)), std::istreambuf_iterator<char>());

    std::ifstream errFile(tmpDir / "err.txt");
    run_err = std::string((std::istreambuf_iterator<char>(errFile)), std::istreambuf_iterator<char>());

    return ret == 0;
}

bool run_nodejs_docker(const std::string& code, const std::string& input,
                       std::string& output, std::string& error) {
    fs::path tmpDir = fs::temp_directory_path() / "node_sandbox";
    fs::create_directories(tmpDir);

    fs::path codePath = tmpDir / "tmp.js";
    std::ofstream(codePath) << code;

    std::ofstream(tmpDir / "input.txt") << input;
    if (!fs::exists(tmpDir / "input.txt")) {
        LOG("input.txt missing before docker run");
    } else {
        LOG("input.txt size = " + std::to_string(fs::file_size(tmpDir / "input.txt")));
    }

    // Fill when empty new line..
    if (input.empty()) {
        std::ofstream(tmpDir / "input.txt") << "\n";
    }

    std::string cmd =
    "docker run --rm --network none -m 256m "
    "--user root "
    "-v " + tmpDir.string() + ":/app "
    "node-sandbox "
    "sh -c \"node /app/tmp.js < /app/input.txt > /app/output.txt 2> /app/err.txt\"";


    // Add input redirection only if input is not empty
    //if (!input.empty()) cmd += " < /app/input.txt";
    //cmd += " > /app/output.txt 2> /app/err.txt";
    LOG(cmd);

    int ret = std::system(cmd.c_str());

    std::ifstream outFile(tmpDir / "output.txt");
    output = std::string((std::istreambuf_iterator<char>(outFile)), std::istreambuf_iterator<char>());

    std::ifstream errFile(tmpDir / "err.txt");
    error = std::string((std::istreambuf_iterator<char>(errFile)), std::istreambuf_iterator<char>());

    return ret == 0;
}

