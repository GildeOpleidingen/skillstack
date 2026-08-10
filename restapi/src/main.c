// save as: server.c
#include "microhttpd.h"
#include <string.h>
#include <stdlib.h>

#define PORT 8888

static enum MHD_Result
answer_to_connection(void *cls, struct MHD_Connection *connection,
                      const char *url, const char *method,
                      const char *version, const char *upload_data,
                      size_t *upload_data_size, void **con_cls)
{
  (void)cls; (void)url; (void)method; (void)version;
  (void)upload_data; (void)con_cls;

  // We only respond once per request body; for GET upload_data_size is 0 anyway.
  if (*upload_data_size != 0) {
    *upload_data_size = 0; // tell libmicrohttpd we consumed it
    return MHD_YES;
  }

  const char *page =
    "Hello from libmicrohttpd!\n";

  int status_code = MHD_HTTP_OK;

  struct MHD_Response *response =
    MHD_create_response_from_buffer(strlen(page),
                                      (void*)page,
                                      MHD_RESPMEM_PERSISTENT);
  int ret = MHD_queue_response(connection, status_code, response);
  MHD_destroy_response(response);
  return ret == MHD_YES ? MHD_YES : MHD_NO;
}

int main(void)
{
  struct MHD_Daemon *daemon;

  daemon = MHD_start_daemon(
      MHD_USE_SELECT_INTERNALLY,
      PORT,
      NULL, NULL, // accept/get policy not used here
      &answer_to_connection, NULL,
      MHD_OPTION_END);

  if (!daemon) return 1;

  // Run forever
  while (1) pause();

  // Not reached, but shown for completeness:
  MHD_stop_daemon(daemon);

  return 0;
}

