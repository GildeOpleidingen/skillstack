
#include "users.h"

// Get some data from mysql
int testQuery()
{
        MYSQL *con = mysql_init(NULL);

        if (con == NULL) {
                fprintf(stderr, "%s\n", mysql_error(con));
                exit(1);
        }

        if (mysql_real_connect(con, "localhost", "rayit", "rayrayray", "skillstack", 0, NULL, 0) == NULL) {
                fprintf(stderr, "%s\n", mysql_error(con));
                mysql_close(con);
                exit(1);
        }

        if(mysql_query(con, "SELECT * FROM users;")) {
                fprintf(stderr, "%s\n", mysql_error(con));
                mysql_close(con);
                exit(1);
        }

        // Store data into a res structure
        MYSQL_RES *res = mysql_store_result(con);

        // Get columns
        int columns = mysql_num_fields(res);

        MYSQL_ROW row;
        int i;

        while(row = mysql_fetch_row(res)) 
        {
                for(i = 0; i < columns; i++) {
                        printf("%s ", row[i]);
                }
                printf("\n");
        }

        mysql_free_result(res);
        mysql_close(con);
        return 0;
}