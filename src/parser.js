// read the argument
// argv[0] = node, argv[1] is server, argv[2] is expression
var expression = process.argv[2];

var expressionTokens = expression.split(" ");
parseCronExpression(expressionTokens); // ~$ your-program "*/15 0 1,15 * 1-5 /usr/bin/find"

/**
 * 
 * @param {cron expression} expressionTokens 
 * @returns {} object containing output in following format
 *  {minute: '',
    hour: '',
    day_of_month: '',
    month: '',
    day_of_week: '',
    command: ''}
 */
function parseCronExpression(expressionTokens) {
    var tokenLength = expressionTokens.length;

    if (tokenLength != 6) {
        console.log("Invalid input, please try again...");
        return;
    }

    var output = {
        minute: '',
        hour: '',
        day_of_month: '',
        month: '',
        day_of_week: '',
        command: ''
    };

    output.minute = _parse(expressionTokens[0], 'minute');
    output.hour = _parse(expressionTokens[1], 'hour');
    output.day_of_month = _parse(expressionTokens[2], 'day_of_month');
    output.month = _parse(expressionTokens[3], 'month');
    output.day_of_week = _parse(expressionTokens[4], 'day_of_week');
    output.command = _parse(expressionTokens[5], 'command');

    console.log(output);
}

// internal method to parse (minute, hour, day of month, month, and day of week) plus a command
function _parse(expressionToken, type) {
    // constraints for each type in expression
    var constraints = [
        { min: 0, max: 59, chars: [] }, // Minute
        { min: 0, max: 23, chars: [] }, // Hour
        { min: 1, max: 31, chars: ['L'] }, // Day of month
        { min: 1, max: 12, chars: [] }, // Month
        { min: 0, max: 7, chars: ['L'] }, // Day of week
    ];

    // no constraint applied for command
    if (type == 'command') {
        return expressionToken;
    }

    // result contains all number for output[type]
    var result, constraint;

    //regex for minute/hours/month AND days of Month/Week
    var daysOfRegex = /^[?,*\dL\/-]+$/;
    var standardRegex = /^[,*\d\/-]+$/;

    if (type == 'minute' || type == 'hour' || type == 'month') {
        if (!standardRegex.test(expressionToken)) {
            console.log("Invalid input, please try again...");
            return;
        }
    }

    if (type == 'day_of_month' || type == 'day_of_week') {
        if (!daysOfRegex.test(expressionToken)) {
            console.log("Invalid input, please try again...");
            return;
        }
    }

    result = [];

    if (type == 'minute') {
        constraint = constraints[0];
    } else if (type == 'hour') {
        constraint = constraints[1];
    } else if (type == 'day_of_month') {
        constraint = constraints[2];
    } else if (type == 'month') {
        constraint = constraints[3];
    } else if (type == 'day_of_week') {
        constraint = constraints[4];
    }

    // "1 0 1,15 * 1-5 /usr/bin/find"
    if (isNumeric(expressionToken)) { // 5
        result.push(+expressionToken);
    } else if (expressionToken == "*") {
        for (let j = constraint.min; j <= constraint.max; j++) {
            result.push(j);
        }
    } else if (expressionToken.indexOf("*/") > -1) { // */2
        var timesValues = +expressionToken.split("*/")[1];
        for (let j = constraint.min; j <= constraint.max; j = j + timesValues) {
            result.push(j);
        }

    } else if (expressionToken.indexOf(",") > -1) { // 1,3-5,7
        var values = expressionToken.split(",");
        for (let i = 0; i < values.length; i++) {
            if (isNumeric(values[i])) {
                if (values[i] < constraint.min || values[i] > constraint.max) {
                    console.log("Invalid input, please try again...");
                    return;
                }

                result.push(+values[i]);

            } else if (values[i].indexOf("-") > -1) {
                var rangeValues = values[i].split("-");
                for (let j = rangeValues[0]; j <= rangeValues[1]; j++) {
                    if (j < constraint.min || j > constraint.max) {
                        console.log("Invalid input, please try again...");
                        return;
                    }

                    result.push(+j);

                }
            }
        }
    } else if (expressionToken.indexOf("-") > -1) {
        var rangeValues = expressionToken.split("-");
        for (let j = rangeValues[0]; j <= rangeValues[1]; j++) {
            if (j < constraint.min || j > constraint.max) {
                console.log("Invalid input, please try again...");
                return;
            }

            result.push(+j);
        }
    }

    return result;
}


// check if value is number or not
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
