#include <event2/event.h>
#include <event2/http.h>
#include <event2/util.h>
#include <event2/buffer.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

static void on_request(struct evhttp_request *req, void *arg)
{
        const char *method = evhttp_request_get_command(req) == EVHTTP_REQ_GET ? "GET" : "OTHER";
        (void)arg;

        struct evkeyvalq *headers_in = evhttp_request_get_input_headers(req);

        // Simple response
        struct evbuffer *buf = evbuffer_new();
        evbuffer_add_printf(buf,
                        "{ \"ok\": true, \"method\": \"%s\", \"msg\": \"evhttp server running\" }\n",
                        method);

        evhttp_add_header(evhttp_request_get_output_headers(req), "Content-Type", "application/json");
        evhttp_send_reply(req, 200, "OK", buf);
        evbuffer_free(buf);
}

int main(int argc, char **argv) 
{
        int port = 8080;

        if (argc >= 2) port = atoi(argv[1]);

        struct event_base *base = event_base_new();

        if (!base) {
                perror("event_base_new");
                return 1;
        }

        struct evhttp *http = evhttp_new(base);

        if (!http) {
                perror("evhttp_new");
                event_base_free(base);
                return 1;
        }

        // Generic request handler
        evhttp_set_gencb(http, on_request, NULL);

        // Bind port on all interfaces
        if (evhttp_bind_socket(http, "0.0.0.0", port) != 0) 
        {
                fprintf(stderr, "Failed to bind port %d\n", port);
                evhttp_free(http);
                event_base_free(base);
                return 1;
        }

        printf("evhttp listening on port %d\n", port);
        event_base_dispatch(base);

        evhttp_free(http);
        event_base_free(base);
        return 0;



}

