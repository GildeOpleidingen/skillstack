/*
 * Copyright (C) 2025 Raymond Marx
 *
 * Permission to use, copy, modify, and distribute this software and its
 * documentation under the terms of the GNU General Public License is hereby 
 * granted. No representations are made about the suitability of this software 
 * for any purpose. It is provided "as is" without express or implied warranty.
 * See the GNU General Public License for more details.
 */

#include <stdio.h>
#include <stdlib.h>
#include <sqlite3.h>
#include <dirent.h>
#include <string.h>
#include <time.h>

#define MAX_PATH    512
#define MAX_SQL     65536

// Get DB_PATH from config.env
char*
get_db_path()
{
  FILE* file = fopen("config.env", "r");
  if (!file) {
    perror("Failed to open config.env, did you create it from config.env.default?");
    return NULL;
  }

  static char path[MAX_PATH];
  char line[256];
  while(fgets(line, sizeof(line), file)) {
    if (sscanf(line, "DB_PATH=%s", path) == 1) {
      fclose(file);
      return path;
    }
  }
  fprintf(stderr, "Database path not found in config.env \n");
  fclose(file);
  return NULL;
}

// Read the contents of a file into a buffer
int
read_sql_file(const char* path, char* buffer, size_t bufsize)
{
  FILE* f = fopen(path, "r");
  if (!f) return -1;

  size_t len = fread(buffer, 1, bufsize - 1, f);
  buffer[len] = '\0';
  fclose(f);
  return 0;
}

// Compare filenames for sorting
int
compare(const void* a, const void* b) 
{
    return strcmp(*(char**)a, *(char**)b);
}

// Check if already applied
int 
is_applied(sqlite3* db, const char* name)
{
  const char* sql = "SELECT COUNT(*) FROM schema_migrations WHERE name=?;";
  sqlite3_stmt* stmt;
  int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
  if ( rc != SQLITE_OK) return 0;

  sqlite3_bind_text(stmt, 1, name, -1, SQLITE_STATIC);
  rc = sqlite3_step(stmt);
  int count = (rc == SQLITE_ROW) ? sqlite3_column_int(stmt, 0) : 0;
  sqlite3_finalize(stmt);
  return count > 0;
}

// Mark a migration as applied
void
mark_applied(sqlite3* db, const char* name)
{
    const char* sql = "INSERT INTO schema_migrations (name) VALUES (?)";
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
    sqlite3_bind_text(stmt, 1, name, -1, SQLITE_STATIC);
    sqlite3_step(stmt);
    sqlite3_finalize(stmt);
}

int 
main(int argc, char** argv)
{
  // TODO look into options (argv) if needed
  char* db_path = get_db_path();
  if(!db_path) {
    return 1;
  }
  printf("Using database: %s \n", get_db_path());

  // BACKUP
  // Get current timestamp
  time_t now = time(NULL);
  struct tm* t = localtime(&now);
  char timestamp[32];
  strftime(timestamp, sizeof(timestamp), "%Y%m%d_%H%M%S", t);

  // Build the command string
  char command[512];
  snprintf(command, sizeof(command),
            "sqlite3 \"%s\" .dump > %s\\_backup_%s.sql", db_path, db_path, timestamp);

  // Execute the command
  int result = system(command);
  if (result != 0) {
      fprintf(stderr, "Backup failed with code %d\n", result);
      return 1;
  }

  printf("Backup saved to backup_%s.sql\n", timestamp);

  sqlite3* db;
  if (sqlite3_open(db_path, &db)) {
    fprintf(stderr, "Problem opening the database error: %s \n", sqlite3_errmsg(db));
    return 1;
  }

  // Create migrations schema if it does not exists
  // Delete views, exercises and triggers so they will be reapplied (every migration YEY)
  const char* create_table_sql = 
    "CREATE TABLE IF NOT EXISTS schema_migrations ("
    "name TEXT PRIMARY KEY);"
    " DELETE FROM schema_migrations WHERE name LIKE 'v_%' OR name LIKE 'exercises%'"
    " OR name LIKE 't_%';";
  if (sqlite3_exec(db, create_table_sql, NULL, NULL, NULL) !=0 ) {
    fprintf(stderr, "Problem creating schema_migrations error: %s \n", sqlite3_errmsg(db));
    sqlite3_close(db);
    return 1;
  }

  // Read migration directory
  struct dirent* entry;
  DIR* dir = opendir("DB/migrations");
  if (!dir) {
    fprintf(stderr, "Problem opening directory DB/migrations");
    sqlite3_close(db);
    return 1;
  }
  
  // Collect filenames in the directory
  char* files[256];
  int count = 0;
  while ( (entry = readdir(dir) ) != NULL) {
    if (entry->d_type == DT_REG && strstr(entry->d_name, ".sql")) {
      files[count] = strdup(entry->d_name);
      count++;
    }
  }
  closedir(dir);

  // Sort
  qsort(files, count, sizeof(char*), compare);

  // Apply migrations
  char filepath[MAX_PATH];
  char sql[MAX_SQL];

  for (int i=0; i < count; i++) {
    snprintf(filepath, sizeof(filepath), "DB/migrations/%s", files[i]);

    // Check if already done in schema_migrations
    if (is_applied(db, files[i])) {
      printf("Skipping already applied: %s\n", files[i]);
      free(files[i]);
      continue;
    }

    if (read_sql_file(filepath, sql, sizeof(sql)) == 0) {
      printf("Applying migration: %s\n", files[i]);

      char* errmsg = NULL;
      if (sqlite3_exec(db, sql, NULL, NULL, &errmsg) == SQLITE_OK) {
          mark_applied(db, files[i]);
          printf("✔ Applied: %s\n", files[i]);
      } else {
          fprintf(stderr, "❌ Error in %s: %s\n", files[i], errmsg);
          sqlite3_free(errmsg);
          break;
      }
    } else {
      fprintf(stderr, "Failed to read file: %s\n", filepath);
    }
    free(files[i]);
  }
  sqlite3_close(db);
  return 0;
}
