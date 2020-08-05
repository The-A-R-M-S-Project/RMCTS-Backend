process.env.NODE_ENV = "test";

const User = require("../models/user");
const server = require("../server");
const data = require("./data");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const client = chai.request.agent(server);
const should = chai.should();

describe("User", () => {
  beforeEach((done) => {
    User.deleteMany({}, () => {});
    done();
  });

  afterEach((done) => {
    User.deleteMany({}, () => {});
    done();
  });

  describe("/POST /users", () => {
    it("Should successfully create new Institution account and send verification token", async () => {
      const { username, email, password } = data.institution2;

      const signupPromise = new Promise((resolve, response) => {
        client
          .post("/users/")
          .send({ username, email, password })
          .then((res) => resolve(res));
      });

      const res = await signupPromise;
        res.should.have.status(200);
        res.body.should.be.a("object");
    });
  });

  describe("/POST /user/login", () => {
    it("Should succesfully login verified user", async (req, res) => {
      const { username, email, password } = data.verifiedUser;

      const signupPromise = new Promise((resolve, response) => {
        client
          .post("/users/")
          .send({ username, email, password })
          .then((res) => resolve(res));
      });

      await signupPromise;
      
    })
  })
});
