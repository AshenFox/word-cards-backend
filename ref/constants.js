const constants = {
  corsURL: "https://hoarfox.github.io", //'' null  "http://127.0.0.1:8080"
  stages: [
    {
      stage: 2,
      nextRep: 900000,
      prevStage: 1800000,
    },
    {
      stage: 3,
      nextRep: 3600000,
      prevStage: 7200000,
    },
    {
      stage: 4,
      nextRep: 10800000,
      prevStage: 21600000,
    },
    {
      stage: 5,
      nextRep: 86400000,
      prevStage: 172800000,
    },
    {
      stage: 6,
      nextRep: 172800000,
      prevStage: 345600000,
    },
    {
      stage: 7,
      nextRep: 345600000,
      prevStage: 691200000,
    },
    {
      stage: 8,
      nextRep: 604800000,
      prevStage: 1209600000,
    },
    {
      stage: 9,
      nextRep: 1209600000,
      prevStage: 2419200000,
    },
    {
      stage: 10,
      nextRep: 2419200000,
      prevStage: 4838400000,
    },
    {
      stage: 11,
      nextRep: 4838400000,
      prevStage: 9676800000,
    },
  ],
};

module.exports = constants;
