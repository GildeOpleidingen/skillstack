#pragma once
#include <string>


bool compile_cpp_docker(const std::string& code, const std::string& out_binary,
                        std::string& compiler_output, std::string& compiler_error);

bool run_cpp_docker(const std::string& bin_path, const std::string& input,
                    std::string& run_out, std::string& run_err);                  

bool run_nodejs_docker(const std::string& code,
const std::string& input,
std::string& output,
std::string& error);

// Compile user-submitted C++ code in isolate sandbox
// // Returns true if compilation succeeded
// bool compile_cpp_isolate(const std::string& code, const std::string& out_path, 
//                             std::string& compiler_output,
//                         std::string& compiler_error);

// // Run compiled binary inside isolate with given input
// // Returns true if run completed successfully (no timeout, no segfault)
// // run_out = stdout, run_err = stderr
// bool run_cpp_isolate(const std::string& bin_path, const std::string& input,
//                      std::string& run_out, std::string& run_err);

// bool compile_nodejs_isolate(const std::string& code, const std::string& out_path, 
//                             std::string& compiler_output,
//                         std::string& compiler_error);

// bool run_nodejs_isolate(const std::string& bin_path, const std::string& input,
//                      std::string& run_out, std::string& run_err);                        