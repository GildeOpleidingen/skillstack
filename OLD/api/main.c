/**
  Test in pure c
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <err.h>

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define SL_NET_LISTEN_BACKLOG       128
#define SL_NET_RECEIVE_BUFFER_SIZE  10240

static int sl_main_running = 1;

int main(int argc, char *argv[])
{
  int server_socket, client_socket;
  struct sockaddr_in server_address, client_address;
  socklen_t size_client_socket = sizeof(client_address);
  int port = 9000;
  uint8_t recv_buffer[SL_NET_RECEIVE_BUFFER_SIZE];
  ssize_t bytes_read;

  // Create a socket
  server_socket = socket(AF_INET,SOCK_STREAM, 0);
  if (server_socket == -1) {
    err(EXIT_SUCCESS, "socket()");
  }

  // To reuse a socket
  int optval = 1;
  setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval));

  // Fill server_address
  bzero(&server_address, sizeof(server_address));
  server_address.sin_family = AF_INET;
  server_address.sin_addr.s_addr = htonl(INADDR_ANY);
  server_address.sin_port = htons(port);
  // Bind server_address
  if (bind(server_socket, (struct sockaddr*) &server_address, sizeof(server_address)) == -1) {
    err(EXIT_SUCCESS, "bind()");
  }

  // Listen
  if(listen(server_socket, SL_NET_LISTEN_BACKLOG)) {
    err(EXIT_SUCCESS, "listen()");
  }

  while(sl_main_running) {

    // accept client
    client_socket = accept(server_socket,(struct sockaddr*) &client_address, &size_client_socket);
    if (client_socket == -1) {
      warn("accept()");
      continue;
    }
    warnx("accept(): Got connection from %s:%d", inet_ntoa(client_address.sin_addr), ntohs(client_address.sin_port));

    // Receive from client
    while((bytes_read = recv(client_socket, recv_buffer, sizeof(recv_buffer),0 )) > 0) {
      if (bytes_read == -1) {
        warn("recv(): Got error reading from %s:%d", inet_ntoa(client_address.sin_addr), ntohs(client_address.sin_port));
        break;
      }

      warnx("recv(): Got %li bytes from %s:%d",bytes_read, inet_ntoa(client_address.sin_addr), ntohs(client_address.sin_port));
      
      for (size_t n = 0; n < bytes_read; n +=16) {
        printf("%08zX ", n);

        for(size_t c = n; c < n + 16 && c < bytes_read; c++ ) {
          printf("%02X", recv_buffer[c]);
        }
        printf("  ");
        for(size_t c = n; c < n + 16 && c < bytes_read; c++ ) {
          printf("%c", recv_buffer[c] >= 0x20 && recv_buffer[c] < 0x7f ? recv_buffer[c] : '.' );
        }
        printf("\n");
      }
      if(bytes_read < SL_NET_RECEIVE_BUFFER_SIZE) {
        break;
      }
    }
    warnx("accept(): Closing connection to %s:%d", inet_ntoa(client_address.sin_addr), ntohs(client_address.sin_port));
    close(client_socket);
  }

  // Clean up
  close(server_socket);
  return EXIT_SUCCESS;
}
