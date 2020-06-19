# Vocab

Meesterproef Minor Web Development

![Poster](docs/poster.png)

![CMS-Poster](docs/cms-poster.png)

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Live Version](#live-version)
- [Design Rationale](#design-rationale)
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

## Design Rationale
Vocab is a concept for a voice user interface which helps students learn Dutch with the help of visual and auditory feedback. This concept has been designed by HvA students from CMD.

Originally Vocab was designed for NT2 education. NT2 education is special education for children between the ages of 6 years and 11 years which have dutch as a second language. The amount of NT2 children in the Netherlands has increased the last few years. Because School attendance for all children between the ages of 5 and 16 is compulsory, these NT2 children are placed in a newcomer class due to their lack of skill in the Dutch language. The amount of these newcomer classes however are scarce and not every NT2 child can get the sufficient amount of education they need. So Vocab is created to help children increase the grasp with the Dutch language. Due to the Covid-19 pandemic the scope of Vocab has been expanded to all children which are learning at home instead of only NT2 children.

To be able to test the concept of Vocab, a working prototype needs to be delivered. With the help of a Design Rationale from the CMD students, this prototype can be built.

### Product
<details>
Vocab consists of multiple components. These components are:
   
- Voice Interface
- Content Management System (CMS)

The Voice interface is made with google conversational actions and shows the 

De voorwaarde van success voor deze opdracht is dat er tenminste een gebruiksvriendelijke CMS geleverd wordt.

#### Voice Interface
<details>
De Voice Interface is het gedeelte dat gebruikt wordt door de leerlingen. Hier krijgen de leerlingen een woord te zien met een gerelateerde afbeelding. De leerlingen moeten dan het woord uitspreken. De Voice Interface geeft dan aan of het woord correct of incorrect is.
</details>

#### Content Management System (CMS)
<details>
VOCAB gebruikt lijsten van woorden die door docenten aangepast kunnen worden. Deze woorden moeten worden beheerd door middel van een CMS. Naast het beheren van de woordenlijsten kunnen ook lijsten van klassen en lijst van leerlingen beheerd worden. 

Naast beheren heeft de CMS ook een rapportage functionaliteit waarbij de vooruitgang per leerling gezien kan worden. Ook is er sprake van een chat functionaliteit tussen Docenten.
</details>

</details>

### Development Process
<details>
Dit project heeft een scrum-achtige opzet. Er zijn vijf sprints die ieder een week duren. Elke maandag is er een soort sprint planning en elke vrijdag is er een soort sprint review waarbij de vooruitgang van de week wordt gepresenteerd. Aan het eind van elke week wordt er dus een Minimum Viable Product (MVP) verwacht. Yuri Westplat is hier de product owner van dit project, Heralt Levant en Tabish Nanhekhan zijn de developers van dit project en Vasilis van Gemert is de coach. Er is zijn ook studenten van HvA CMD die als Design Team fungeren.

Hier zijn alle deelnemers van dit project:
- Yuri Westplat (Product Owner)
- Vasilis van Gemert (Coach)
- Students HvA CMD (Design Team)
- Heralt Levant (Developer)
- Tabish Nanhekhan (Developer)
</details>

<!---
## Components
<details>
<summary>Dialogflow intents</summary>
The logic for the catching the spoken words of the user when using the app and doing something with it, is in the functions/dialogFlowApp folder. This file contains the intents(chunks of code that correspond to certain things a user says) and the responses that the user hears. This file is a mess, I want to keep the responses that the user hears and the logic for doing certain checks seperate. This will improve the readability.
</details>
-->

## Built With
- [Firebase](https://firebase.google.com/): A comprehensive app development platform built on Google infrastructure.
- [Google Conversational Actions](https://developers.google.com/assistant/conversational/overview): Custom experiences, or conversations, for users of Google Assistant.
- [Dialogflow](https://dialogflow.com/): Platform for engaging voice and text-based conversational interfaces with natural language processing.
- [Node.js](https://nodejs.org/en/): A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/): A minimal and flexible Node.js web application framework.
- [EJS](https://ejs.co/): Embedded JavaScript templating.

## License
[MIT](https://choosealicense.com/licenses/mit/)
