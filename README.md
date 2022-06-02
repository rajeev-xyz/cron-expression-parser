# Cron Expression Parser

## This is command line application written in NodeJS to parse a cron string and expands each field to show the times at which it will run.

### To run this applicaton, you must have node and npm installed on your system


### To run this applicaton, do following:

> cd CronExpressionParser
\
> npm install
\
> node ./src/parser  "*/15 0 1,15 * 1-5 /usr/bin/find"

### You should see following output

`
{
    minute: [ 0, 15, 30, 45 ],
    hour: [ 0 ],
    day_of_month: [ 1, 15 ],
    month: [
        1,  2, 3, 4,  5,
        6,  7, 8, 9, 10,
        11, 12
    ],
    day_of_week: [ 1, 2, 3, 4, 5 ],
    command: '/usr/bin/find'
};
`
