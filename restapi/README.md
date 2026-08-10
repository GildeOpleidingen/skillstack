
// Wowzers let's do something stupid
// Make a rest API in C

// Dependencies:
//   microhttpd
//   libpq (postgress)


sudo pacman -S libmicrohttpd

clang api.c -o server -lmicrohttpd
