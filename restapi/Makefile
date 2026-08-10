CC = gcc
CFLAGS = -Wall -Iinclude
LIBS = -levent -levent_core -levent_extra

SRC = src/main.c
OBJ = $(SRC:.c=.o)
TARGET = http_server

all:$(TARGET)

$(TARGET):$(OBJ)
	$(CC) $(CFLAGS) -o $@ $^ $(LIBS)

clean:
	rm -f $(OBJ) $(TARGET)
