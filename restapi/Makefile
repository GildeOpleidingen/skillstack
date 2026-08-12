CC = gcc
CFLAGS = -Wall -Iinclude -I/usr/local/include
LDFLAGS = -L/usr/local/lib -Wl,-rpath,/usr/local/lib
LIBS = -levent_core -levent_extra

SRC = src/main.c
OBJ = src/main.o
TARGET = http_server

all: $(TARGET)

$(OBJ): $(SRC)
	$(CC) $(CFLAGS) -c $< -o $@

$(TARGET): $(OBJ)
	$(CC) $(CFLAGS) -o $@ $(OBJ) $(LIBS)

clean:
	rm -f $(OBJ) $(TARGET)
