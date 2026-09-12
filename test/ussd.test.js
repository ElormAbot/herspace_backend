const test = require("node:test");
const assert = require("node:assert/strict");

const { handleUssd } = require("../src/ussd");


/*
 * Test 1
 *
 * A new user should receive the
 * HerSpace main menu.
 */

test("shows HerSpace home menu", () => {

  const result = handleUssd({
    sessionId: "test-home",
    text: ""
  });

  assert.match(
    result,
    /^CON Welcome to HerSpace/
  );

  assert.match(
    result,
    /1\. Learn about Cervical Cancer/
  );

  assert.match(
    result,
    /2\. Find a Screening Centre/
  );

  assert.match(
    result,
    /3\. Treatment Support/
  );
});


/*
 * Test 2
 *
 * Selecting option 3 should take
 * the user to Treatment Support.
 */

test("routes to Treatment Support", () => {

  handleUssd({
    sessionId: "test-treatment",
    text: ""
  });

  const result = handleUssd({
    sessionId: "test-treatment",
    text: "3"
  });

  assert.match(
    result,
    /^CON Treatment Support/
  );

  assert.match(
    result,
    /1\. Next appointment/
  );

  assert.match(
    result,
    /2\. Treatment reminders/
  );

  assert.match(
    result,
    /3\. Continue treatment/
  );
});


/*
 * Test 3
 *
 * Selecting Treatment Support →
 * Next appointment should show
 * the appointment information.
 */

test("shows next appointment", () => {

  handleUssd({
    sessionId: "test-appointment",
    text: ""
  });

  handleUssd({
    sessionId: "test-appointment",
    text: "3"
  });

  const result = handleUssd({
    sessionId: "test-appointment",
    text: "1"
  });

  assert.match(
    result,
    /^CON Sample record/
  );

  assert.match(
    result,
    /18 Sep 2026/
  );
});


/*
 * Test 4
 *
 * Confirming the appointment should
 * terminate the USSD session.
 */

test("confirms appointment and ends session", () => {

  handleUssd({
    sessionId: "test-confirm",
    text: ""
  });

  handleUssd({
    sessionId: "test-confirm",
    text: "3"
  });

  const appointment = handleUssd({
    sessionId: "test-confirm",
    text: "1"
  });

  assert.match(
    appointment,
    /^CON/
  );

  const confirmation = handleUssd({
    sessionId: "test-confirm",
    text: "1"
  });

  assert.match(
    confirmation,
    /^END/
  );

  assert.match(
    confirmation,
    /appointment/i
  );
});


/*
 * Test 5
 *
 * The backend should also understand
 * a complete USSD path such as:
 *
 * 2*1
 *
 * which means:
 *
 * Find Screening Centre
 * → Greater Accra
 */

test("supports a complete USSD navigation path", () => {

  const result = handleUssd({
    sessionId: "test-path",
    text: "2*1"
  });

  assert.match(
    result,
    /^CON Greater Accra/
  );
});


/*
 * Test 6
 *
 * Invalid menu selections should not
 * crash the application.
 */

test("handles invalid menu options", () => {

  handleUssd({
    sessionId: "test-invalid",
    text: ""
  });

  const result = handleUssd({
    sessionId: "test-invalid",
    text: "99"
  });

  assert.match(
    result,
    /^CON Invalid option/
  );
});


/*
 * Test 7
 *
 * Selecting 0 from the home menu
 * should end the session.
 */

test("exits from the home menu", () => {

  handleUssd({
    sessionId: "test-exit",
    text: ""
  });

  const result = handleUssd({
    sessionId: "test-exit",
    text: "0"
  });

  assert.match(
    result,
    /^END/
  );
});
