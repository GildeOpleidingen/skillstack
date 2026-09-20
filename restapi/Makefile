CC = gcc

CPPFLAGS = -Iinclude -I/usr/local/include
CFLAGS = -Wall -Wextra -O2
LDFLAGS = -L/usr/local/lib -Wl,-rpath,/usr/local/lib
LDLIBS = -levent_core -levent_extra -lmysqlclient

SRC_DIR = src
TARGET = http_server

SOURCES := $(shell find $(SRC_DIR) -type f -name '*.c')
OBJECTS := $(SOURCES:.c=.o)

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $(LDFLAGS) -o $@ $^ $(LDLIBS)

$(SRC_DIR)/%.o: $(SRC_DIR)/%.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -MMD -MP -c $< -o $@

-include $(OBJECTS:.o=.d)

clean:
	rm -f $(OBJECTS) $(OBJECTS:.o=.d) $(TARGET)
