import superagent from 'superagent';
import { When, Then } from 'cucumber';

let request;
let result;
let error;

When('the client creates a POST request to /users', function () {
  request = superagent('POST', 'localhost:8080/users');
});


When('attaches a generic empty payload', function () {
  return undefined;
});
When('sends the request', function (callback) {
  request
    .then((response) => {
      result = response.res;
      callback();
    })
    .catch((errorResponse) => {
      error = errorResponse.response;
      callback();
    });
});
Then('our API should respond with a 400 HTTP status code', function () {
  if (error.statusCode !== 400) {
    throw new Error();
  }
});
Then('the payload of the response should be a JSON object', function () {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of Content-Type application/json');
  }
  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (e) {
    throw new Error('Response not a valid JSON object');
  }
});
Then('contains a message property which says "Payload should not be empty"', function () {
  if (this.responsePayload.message !== 'Payload should not be empty') {
    throw new Error();
  }
});
