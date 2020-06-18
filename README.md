# Vocab

Meesterproef Minor Web Development

![Poster](docs/poster.png)

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Live Version](#live-version)
- [Components](#components)
- [Built with](#built-with)
- [License](#license)

## Installation
Clone this repo with your favourite GIT CLI or GUI.  
CD to the root of the project folder.  
Run ` npm install ` to install this project and its necessary dependencies.  
CD to the `functions` folder.
Run ` npm install ` to install the firebase functions and its necessary dependencies.  

## Usage
CD to the root of the project folder.  
Run `firebase serve` and go to `localhost:5000` to see the dev version running.  
For the CMS:  navigate to `localhost:5000/cms`.

## Live Version
Hosting: `https://vocab-project.web.app/` or `https://vocab-project.firebaseapp.com/`  
Navigate to `https://vocab-project.web.app/cms` or `https://vocab-project.firebaseapp.com/cms` for the CMS.

## Components
<details>
<summary>Dialogflow intents</summary>
The logic for the catching the spoken words of the user when using the app and doing something with it, is in the functions/dialogFlowApp folder. This file contains the intents(chunks of code that correspond to certain things a user says) and the responses that the user hears. This file is a mess, I want to keep the responses that the user hears and the logic for doing certain checks seperate. This will improve the readability.
</details>

## Built With
- [Firebase](https://firebase.google.com/): A comprehensive app development platform built on Google infrastructure.
- [Google Conversational Actions](https://developers.google.com/assistant/conversational/overview): Custom experiences, or conversations, for users of Google Assistant.
- [Dialogflow](https://dialogflow.com/): Platform for engaging voice and text-based conversational interfaces with natural language processing.
- [Node.js](https://nodejs.org/en/): A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/): A minimal and flexible Node.js web application framework.
- [EJS](https://ejs.co/): Embedded JavaScript templating.

## License
[MIT](https://choosealicense.com/licenses/mit/)
