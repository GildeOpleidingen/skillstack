# === CONFIGURATION ===

CXX := g++
CXXFLAGS := -std=c++17 -Wall -O2
LDFLAGS := -lcurl -lsqlite3 -lfcgi
INCLUDES := -Iapi/include

DAEMON_DIR := daemon
BIN_DIR := bin
CGI_DIR := cgi-bin
API_DIR := api
API_TARGET := $(CGI_DIR)/api.cgi

DAEMON_SRC   := $(DAEMON_DIR)/daemon.cpp
DAEMON_OBJ   := $(BIN_DIR)/daemon.o
DAEMON_BIN   := graderd

MIGRATIONS_SRC := DB/script/migrations.c
MIGRATIONS_BIN := migrations

TEMPLATES := templates

# === SOURCE & OBJECT FILES ===
CORE_SRCS := $(wildcard $(API_DIR)/*.cpp)
CORE_OBJS := $(CORE_SRCS:$(API_DIR)/%.cpp=$(BIN_DIR)/%.o)

API_MAIN := $(API_DIR)/main.cpp
API_SRCS := $(filter-out $(API_MAIN), $(wildcard $(API_DIR)/*.cpp))
API_OBJS := $(API_SRCS:$(API_DIR)/%.cpp=$(BIN_DIR)/api_%.o)

# === DEFAULT TARGET ===
all: $(BIN_DIR) $(CGI_DIR) $(BIN_DIR)/libcore.a $(CGI_TARGETS) $(API_TARGET) $(DAEMON_BIN) $(MIGRATIONS_BIN)

# === DIRECTORIES ===
$(BIN_DIR):
	mkdir -p $(BIN_DIR)
$(CGI_DIR):
	mkdir -p $(CGI_DIR)

# === OBJECT RULES ===
$(BIN_DIR)/%.o: $(API_DIR)/%.cpp | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

$(MIGRATIONS_BIN): $(MIGRATIONS_SRC)
	$(CXX) $(CXXFLAGS) -o $@ $< -lsqlite3

# === STATIC LIBRARY ===
$(BIN_DIR)/libcore.a: $(CORE_OBJS)
	ar rcs $@ $^

# === API ROUTE ===
$(API_TARGET): $(API_MAIN) $(API_OBJS) $(BIN_DIR)/libcore.a
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^ $(LDFLAGS)
$(BIN_DIR)/api_%.o: $(API_DIR)/%.cpp | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# === DAEMON BINARY ===
$(BIN_DIR)/grade.o: $(DAEMON_DIR)/grade.cpp | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@
$(BIN_DIR)/utils.o: $(API_DIR)/utils.cpp | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@
$(BIN_DIR)/db.o: $(API_DIR)/db.cpp | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@
$(DAEMON_BIN): $(DAEMON_OBJ) $(BIN_DIR)/grade.o $(BIN_DIR)/config.o $(BIN_DIR)/utils.o $(BIN_DIR)/db.o
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^ $(LDFLAGS)

$(DAEMON_OBJ): $(DAEMON_SRC) | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# === CLEAN ===
clean:
	rm -rf $(BIN_DIR)/*.o $(BIN_DIR)/libcore.a $(CGI_DIR)/*.cgi $(DAEMON_BIN) $(API_TARGET)

# === PHONY ===
.PHONY: all clean
