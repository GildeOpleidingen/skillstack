#include <streambuf>

class fcgi_streambuf : public std::streambuf {
public:
    fcgi_streambuf(FCGX_Stream* fcgx_stream) : fcgx_stream(fcgx_stream) {}

protected:
    virtual int overflow(int c) override {
        if (c != EOF) {
            char z = c;
            if (FCGX_PutStr(&z, 1, fcgx_stream) != 1)
                return EOF;
        }
        return c;
    }

    virtual int sync() override {
        return FCGX_FFlush(fcgx_stream);
    }

    virtual std::streamsize xsputn(const char* s, std::streamsize n) override {
        return FCGX_PutStr(const_cast<char*>(s), n, fcgx_stream);
    }

private:
    FCGX_Stream* fcgx_stream;
};