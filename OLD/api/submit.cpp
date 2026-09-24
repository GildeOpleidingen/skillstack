#include <nlohmann/json.hpp>
#include <string>
#include <iostream>
#include "include/db.h"
#include "include/api/submit.h"
#include "include/utils.h"

using json = nlohmann::json;

int handle_submit(sqlite3* db, int user_id, FCGX_Request *request) {
  // Get ex_id (exercise id) from url
  int ex_id = 0;
  std::string submitted_code = "";
  std::string code = read_stdin(request);  // or however you're reading POST body

  std::unordered_map<std::string, std::string> form = parse_form_data(code);

  auto idIt = form.find("id");   // or "id"
  if (idIt == form.end() || idIt->second.empty()) {
    send_json_error(400, "Missing 'id' field");
    return 1;
  }

  ex_id = std::stoi(idIt->second);

  auto codeIt = form.find("code");
  if (codeIt == form.end()) {  
    send_json_error(400, "Missing 'code' field");
    return 1;
  }

  submitted_code = codeIt->second;

  // Load the exercise from DB
  std::string title,desc,input,expected; int max_score; int score = 0;
  int is_active, sub_id = 0;
  std::vector<ExerciseBlock> blocks;
  load_exercise(db,ex_id,title,input,expected,max_score, is_active, blocks, sub_id);

  std::string result = "";
  int submission_id = log_submission(db,user_id,ex_id,submitted_code,result,score);
  close_db(db);
  if( submission_id == 0) {
    LOG_ERR("Missing submission_id in post");
    send_json_error(400, "Missing submission_id");
    return 1;
  }
  json res = {
            {{"ex_id", ex_id}, {"code", submitted_code}, {"user_id", user_id}, {"submission_id", submission_id}}
  };
  std::cout << "Content-Type: application/json\r\n\r\n";
  std::cout << res.dump();
  return 0;
}
