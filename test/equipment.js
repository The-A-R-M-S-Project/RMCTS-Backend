process.env.NODE_ENV = "test";

const User = require("../models/user");
const Item = require("../models/item");
const server = require("../server");
const data = require("./data");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { createUser } = require("../scripts/createuser");

chai.use(chaiHttp);
const client = chai.request.agent(server);
chai.should();

describe("Equipment", () => {
  beforeEach((done) => {
    User.deleteMany({}, () => {});
    Item.deleteMany({}, () => {});
    done();
  });

  afterEach((done) => {
    User.deleteMany({}, () => {});
    Item.deleteMany({}, () => {});
    done();
  });

  
});
