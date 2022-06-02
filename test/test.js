const parser = require('../src/parser.js');
 
describe("parser", () => {
    it("cron expression parser", () => {
      var output = {
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

      expect(parser("*/15 0 1,15 * 1-5 /usr/bin/find")).toBe(output);
    });
  });