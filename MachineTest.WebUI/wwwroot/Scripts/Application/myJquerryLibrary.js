$(function () {
    tSmart.GridController = function () {
        var dataGrid,
            selectBoxYear, domainName, baseUrl;

        var that = this;
        domainName = document.querySelector("#domainNameId").value;
        //Simplify your JavaScript – Use .map(), .reduce(), and .filter()   //https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
        // What you have
        var officers = [
            { id: 20, name: 'Captain Piett' },
            { id: 24, name: 'General Veers' },
            { id: 56, name: 'Admiral Ozzel' },
            { id: 88, name: 'Commander Jerjerrod' }
        ];
        // What you need
        //[20, 24, 56, 88]

        //First Method for Map
        var officersIds = officers.map(function (officer) {
            return officer.id
        });

        //Second Method for requires ES6 support, Babel or TypeScript
        const officersId = officers.map(officer => officer.id);

        var pilots = [
            {
                id: 10,
                name: "Poe Dameron",
                years: 14,
            },
            {
                id: 2,
                name: "Temmin 'Snap' Wexley",
                years: 30,
            },
            {
                id: 41,
                name: "Tallissan Lintra",
                years: 16,
            },
            {
                id: 99,
                name: "Ello Asty",
                years: 22,
            }
        ];

        //We need to know the total years of experience of all of them. With .reduce(), it’s pretty straightforward like below:
        //First Method for Reduce
        var totalYears = pilots.reduce(function (accumulator, pilot) {
            return accumulator + pilot.years;
        }, 0);

        //Second Method for requires ES6 support, Babel or TypeScript
        const totalYear = pilots.reduce((acc, pilot) => acc + pilot.years, 0);

        //Now let’s say I want to find which pilot is the most experienced one
        var mostExpPilot = pilots.reduce(function (oldest, pilot) {
            return (oldest.years || 0) > pilot.years ? oldest : pilot;
        }, {});

        //What if you have an array, but only want some of the elements in it? That’s where .filter() comes in!
        var pilot = [
            {
                id: 2,
                name: "Wedge Antilles",
                faction: "Rebels",
            },
            {
                id: 8,
                name: "Ciena Ree",
                faction: "Empire",
            },
            {
                id: 40,
                name: "Iden Versio",
                faction: "Empire",
            },
            {
                id: 66,
                name: "Thane Kyrell",
                faction: "Rebels",
            }
        ];

        var rebels = pilot.filter(function (pilot) {
            return pilot.faction === "Rebels";
        });
        var empire = pilot.filter(function (pilot) {
            return pilot.faction === "Empire";
        });

        //That’s it! And it’s even shorter with arrow functions:
        const rebel = pilot.filter(pilot => pilot.faction === "Rebels");
        const empires = pilot.filter(pilot => pilot.faction === "Empire");

        //Combining .map(), .reduce(), and .filter()
        var personnel = [
            {
                id: 5,
                name: "Luke Skywalker",
                pilotingScore: 98,
                shootingScore: 56,
                isForceUser: true,
            },
            {
                id: 82,
                name: "Sabine Wren",
                pilotingScore: 73,
                shootingScore: 99,
                isForceUser: false,
            },
            {
                id: 22,
                name: "Zeb Orellios",
                pilotingScore: 20,
                shootingScore: 59,
                isForceUser: false,
            },
            {
                id: 15,
                name: "Ezra Bridger",
                pilotingScore: 43,
                shootingScore: 67,
                isForceUser: true,
            },
            {
                id: 11,
                name: "Caleb Dume",
                pilotingScore: 71,
                shootingScore: 85,
                isForceUser: true,
            },
        ];

        //First, we need to filter out the personnel who can’t use the force:
        var jediPersonnel = personnel.filter(function (person) {
            return person.isForceUser;
        });
        // Result: [{...}, {...}, {...}] (Luke, Ezra and Caleb)


        //With that we have 3 elements left in our resulting array. We now need to create an array containing the total score of each Jedi.
        var jediScores = jediPersonnel.map(function (jedi) {
            return jedi.pilotingScore + jedi.shootingScore;
        });
        // Result: [154, 110, 156]


        //And let’s use reduce to get the total:
        var totalJediScore = jediScores.reduce(function (acc, score) {
            return acc + score;
        }, 0);
        // Result: 420

        //And now here’s the fun part… we can chain all of this to get what we want in a single line:
        var totalJediScore1 = personnel
            .filter(function (person) {
                return person.isForceUser;
            })
            .map(function (jedi) {
                return jedi.pilotingScore + jedi.shootingScore;
            })
            .reduce(function (acc, score) {
                return acc + score;
            }, 0);

        //And look how pretty it is with arrow functions:
        const totalJediScore2 = personnel
            .filter(person => person.isForceUser)
            .map(jedi => jedi.pilotingScore + jedi.shootingScore)
            .reduce((acc, score) => acc + score, 0);

        //Formatting Say you need to display a list of people, with their name and job title.
        var data = [
            {
                name: "Jan Dodonna",
                title: "General",
            },
            {
                name: "Gial Ackbar",
                title: "Admiral",
            },
        ]

        var results1 = [];
        data.forEach(function (element) {
            var formatted = formatElement(element);
            results1.push(formatted);
        });
        var results2 = data.map(formatElement);

        //Using Some
        var operatives = [
            { id: 12, name: 'Baze Malbus', pilot: false },
            { id: 44, name: 'Bodhi Rook', pilot: true },
            { id: 59, name: 'Chirrut Îmwe', pilot: false },
            { id: 122, name: 'Jyn Erso', pilot: false }
        ];

        //1st Method
        var listHasPilots = operatives.some(function (operative) {
            return operative.pilot;
        });

        //2nd Method. requires ES6 support, Babel or TypeScript
        const listHasPilot = operatives.some(operative => operative.pilot);

        //Using Find. 1st Method
        var firstPilot = operatives.find(function (operative) {
            return operative.pilot;
        });

        //2nd Method. requires ES6 support, Babel or TypeScript
        const firstPilots = operatives.find(operative => operative.pilot);

    }

    tSmart.gridController = tSmart.gridController || new tSmart.GridController;
    //tSmart.gridController.initPage();
    //tSmart.gridController.searchPanel();
});




