const sessions = new Map();

/*
 * HERSPACE USSD MENU STRUCTURE
 */

const menu = {
  home: [
    ["1", "Learn about Cervical Cancer", "info"],
    ["2", "Find a Screening Centre", "screening"],
    ["3", "Treatment Support", "treatment"],
    ["4", "My Appointments", "appointments"],
    ["5", "Cost & Financial Support", "cost"],
    ["6", "Talk to a Health Navigator", "navigator"]
  ],

  info: [
    ["1", "What is cervical cancer?", "what"],
    ["2", "Symptoms", "symptoms"],
    ["3", "Prevention", "prevention"],
    ["4", "Screening", "screeningInfo"],
    ["5", "HPV vaccination", "hpv"]
  ],

  screening: [
    ["1", "Greater Accra", "accra"],
    ["2", "Ashanti", "ashanti"],
    ["3", "Eastern", "eastern"],
    ["4", "Central", "central"]
  ],

  treatment: [
    ["1", "Next appointment", "nextappt"],
    ["2", "Treatment reminders", "reminders"],
    ["3", "Continue treatment", "continue"],
    ["4", "Financial assistance", "finance"],
    ["5", "Speak to navigator", "navigator"]
  ],

  appointments: [
    ["1", "Confirm next appointment", "confirm"],
    ["2", "Request a callback", "callback"]
  ],

  cost: [
    ["1", "Cost information", "costinfo"],
    ["2", "Request financial support", "supportrequest"],
    ["3", "Speak to navigator", "navigator"]
  ],

  navigator: [
    ["1", "Request a callback", "callback"],
    ["2", "Find screening support", "screening"]
  ]
};


/*
 * HERSPACE INFORMATION
 *
 * These are demo responses.
 * They should be reviewed by qualified health professionals
 * before being used in a live service.
 */

const content = {

  what:
    "Cervical cancer develops in the cervix. Most cases can be prevented through HPV vaccination, screening and timely treatment.",

  symptoms:
    "Possible warning signs include unusual bleeding, bleeding after sex, unusual vaginal discharge or pelvic pain. Seek care for concerning symptoms.",

  prevention:
    "Prevention includes HPV vaccination, regular screening and timely follow-up of abnormal results.",

  screeningInfo:
    "Screening can find cervical changes before they become cancer. Ask a qualified health professional which screening option is appropriate for you.",

  hpv:
    "HPV vaccination helps prevent infection with HPV types that can cause cervical cancer. Ask a health professional about eligibility and availability.",

  accra:
    "Sample centres:\n1. Korle Bu Teaching Hospital\n2. Ridge Hospital\n\nCall a navigator to confirm services before visiting.",

  ashanti:
    "Sample centre:\n1. Komfo Anokye Teaching Hospital\n\nCall a navigator to confirm services before visiting.",

  eastern:
    "HerSpace can connect you with available screening services in your area.",

  central:
    "HerSpace can connect you with available screening services in your area.",

  nextappt:
    "Sample record:\n18 Sep 2026, 10:00 AM\nFacility: Your selected treatment centre",

  reminders:
    "Reminder requested. In a live HerSpace service, your reminder preference would be saved and an SMS reminder would be sent.",

  continue:
    "You are due to continue treatment. HerSpace can help with treatment reminders and navigator support.",

  finance:
    "HerSpace can help identify available support pathways and connect you with a health navigator.",

  costinfo:
    "Costs vary by facility, treatment plan and eligibility for coverage or assistance. A navigator can help with next steps.",

  supportrequest:
    "Your support request has been recorded for this demo. A health navigator would contact you to discuss available options.",

  callback:
    "Thank you. In a live HerSpace service, a health navigator would call you back.",

  confirm:
    "Your appointment is marked as confirmed for this demo."
};


/*
 * Creates a USSD response.
 *
 * CON = continue the session
 * END = terminate the session
 */

function response(type, text) {
  return `${type} ${text}`;
}


/*
 * Turns menu options into numbered USSD text.
 */

function numbered(options) {
  return options
    .map(([number, label]) => `${number}. ${label}`)
    .join("\n");
}


/*
 * Builds the screen for each menu.
 */

function screenFor(state) {

  switch (state) {

    case "home":

      return response(
        "CON",
        "Welcome to HerSpace\n\n" +
        numbered(menu.home) +
        "\n0. Exit"
      );


    case "info":

      return response(
        "CON",
        "Cervical Cancer Information\n\n" +
        numbered(menu.info) +
        "\n0. Back"
      );


    case "screening":

      return response(
        "CON",
        "Find a Screening Centre\n\n" +
        numbered(menu.screening) +
        "\n0. Back"
      );


    case "treatment":

      return response(
        "CON",
        "Treatment Support\n\n" +
        numbered(menu.treatment) +
        "\n0. Back"
      );


    case "appointments":

      return response(
        "CON",
        "My Appointments\n\n" +
        numbered(menu.appointments) +
        "\n0. Back"
      );


    case "cost":

      return response(
        "CON",
        "Cost & Financial Support\n\n" +
        numbered(menu.cost) +
        "\n0. Back"
      );


    case "navigator":

      return response(
        "CON",
        "Health Navigator\n\n" +
        numbered(menu.navigator) +
        "\n0. Back"
      );


    default:

      if (content[state]) {

        return response(
          "CON",
          content[state] +
          "\n\n0. Back"
        );

      }

      return response(
        "END",
        "Thank you for using HerSpace."
      );
  }
}


/*
 * Determines where the user goes after
 * selecting an option.
 */

function nextState(state, input) {

  const options = menu[state] || [];

  /*
   * 0 means Back or Exit.
   */

  if (input === "0") {

    if (state === "home") {
      return "END";
    }

    /*
     * Return to the main menu from
     * the major menu sections.
     */

    const mainMenus = [
      "info",
      "screening",
      "treatment",
      "appointments",
      "cost",
      "navigator"
    ];

    if (mainMenus.includes(state)) {
      return "home";
    }

    return state;
  }


  /*
   * Find the selected menu option.
   */

  const selected = options.find(
    ([number]) => number === input
  );


  if (selected) {
    return selected[2];
  }


  return null;
}


/*
 * Main USSD handler.
 *
 * Africa's Talking sends:
 *
 * sessionId
 * serviceCode
 * phoneNumber
 * text
 */

function handleUssd({
  sessionId,
  text
}) {

  const input = (text || "").trim();


  /*
   * A blank text means this is
   * the beginning of a new USSD session.
   */

  if (!input) {

    sessions.set(
      sessionId,
      "home"
    );

    return screenFor("home");
  }


  /*
   * Find the user's current location
   * in the menu.
   */

  const current =
    sessions.get(sessionId) || "home";


  /*
   * USSD providers may send the entire
   * navigation path:
   *
   * 3
   * 3*1
   * 3*1*1
   *
   * We support that format.
   */

  const parts =
    input.split("*");


  /*
   * Start at home and replay the path.
   */

  let state = current;


  if (parts.length > 1) {

    state = "home";

    for (const part of parts) {

      const candidate =
        nextState(state, part);


      if (!candidate) {
        break;
      }


      if (candidate === "END") {

        sessions.delete(sessionId);

        return response(
          "END",
          "Thank you for using HerSpace."
        );
      }


      state = candidate;
    }

  } else {

    const next =
      nextState(
        current,
        parts[0]
      );


    /*
     * Invalid option.
     */

    if (!next) {

      return response(
        "CON",
        "Invalid option.\n\n" +
        screenFor(current).replace(
          /^CON /,
          ""
        )
      );
    }


    /*
     * User selected Exit.
     */

    if (next === "END") {

      sessions.delete(sessionId);

      return response(
        "END",
        "Thank you for using HerSpace."
      );
    }


    state = next;
  }


  /*
   * Save the user's current position.
   */

  sessions.set(
    sessionId,
    state
  );


  /*
   * These actions finish the session.
   */

  const terminalScreens = [
    "reminders",
    "supportrequest",
    "callback",
    "confirm"
  ];


  if (
    terminalScreens.includes(state)
  ) {

    sessions.delete(sessionId);

    return response(
      "END",
      content[state]
    );
  }


  /*
   * Return the next USSD screen.
   */

  return screenFor(state);
}


/*
 * Export the handler so server.js
 * can use it.
 */

module.exports = {
  handleUssd
};
