const constants = {
  corsURL: process.env.PORT
    ? "https://hoarfox.github.io"
    : "http://127.0.0.1:8080",
  stages: [
    {
      stage: 2,
      nextRep: 900000,
      prevStage: 2700000,
    },
    {
      stage: 3,
      nextRep: 3600000,
      prevStage: 10800000,
    },
    {
      stage: 4,
      nextRep: 10800000,
      prevStage: 32400000,
    },
    {
      stage: 5,
      nextRep: 86400000,
      prevStage: 259200000,
    },
    {
      stage: 6,
      nextRep: 172800000,
      prevStage: 518400000,
    },
    {
      stage: 7,
      nextRep: 345600000,
      prevStage: 1036800000,
    },
    {
      stage: 8,
      nextRep: 604800000,
      prevStage: 1814400000,
    },
    {
      stage: 9,
      nextRep: 1209600000,
      prevStage: 3628800000,
    },
    {
      stage: 10,
      nextRep: 2419200000,
      prevStage: 7257600000,
    },
    {
      stage: 11,
      nextRep: 4838400000,
      prevStage: 14515200000,
    },
  ],
};

module.exports = constants;
