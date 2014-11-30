module.exports = {
  "views": [
  {
    "path" : "/instruments", 
    "type" : "twelveZeroZero", 
    "widgets" : {
      "north" : ["instrumentList"]
    }
  },
  {
    "path" : "/instrument/:symbol/details",
    "type" : "twelveSixSix",
    "widgets" : {
      "north" : ["tradeButtons"],
      "east" : ["stockInfo"],
      "west" : ["graph"]
    }
  },
  {
    "path" : "/register",
    "type" : "twelveZeroZero",
    "widgets" : {
      "north" : ["register"]
    }
  },
  {
    "path" : "/registerok",
    "type" : "twelveZeroZero",
    "widgets" : {
      "north" : ["registerOk"]
    }
  },
  {
    "path" : "/home",
    "type" : "twelveSixSix",
    "widgets" : {
      "north": ["dashboard"],
      "east" : ["custodies"],
      "west" : ["cashAccounts"]
    }
  },
  {
    "path" : "/tradeflow/:action/instrument/:symbol",
    "type" : "zeroSixSix",
    "widgets" : {
      "east" : ["tradeFlow"],
      "west" : ["stockInfo"]
    }
  },
    {
    "path" : "/assetoverview/:id",
    "type" : "twelveZeroZero",
    "widgets" : {
      "north" : ["custodySelector", "assetOverview"]
    }
  }
  ]
};