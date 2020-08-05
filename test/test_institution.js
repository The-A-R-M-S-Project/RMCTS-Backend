process.env.NODE_ENV = "test";

const User = require("../models/user");
const Token = require("../models/token");
const server = require("../server");
const data = require("./data");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const client = chai.request.agent(server);
const should = chai.should();

const createUser = async (data) => {
  const user = new User(data);
  await user.save();
  return user;
};

describe("User", () => {
  beforeEach((done) => {
    User.deleteMany({}, () => {});
    Token.deleteMany({}, () => {});
    done();
  });

  afterEach((done) => {
    User.deleteMany({}, () => {});
    Token.deleteMany({}, () => {});
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
      res.body.should.have
        .property("msg")
        .eq("A verification email has been sent to " + email + ".");
    });
  });

  describe("/POST /users/login", () => {
    it("Should succesfully login verified account", async () => {
      await createUser(data.verifiedInstitution);
      const { email, password } = data.verifiedInstitution;

      const loginPromise = new Promise((resolve, response) => {
        client
          .post("/users/login")
          .send({ email, password })
          .then((res) => {
            resolve(res);
          });
      });

      const res = await loginPromise;
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("status").eq("success");
      res.body.should.have.property("token");
      res.body.should.have.property("data");
    });
  });

  describe("/POST /users/login", () => {
    it("Should succesfully detect unverified account", async () => {
      await createUser(data.unVerifiedInstitution);

      const { email, password } = data.unVerifiedInstitution;

      const loginPromise = new Promise((resolve, response) => {
        client
          .post("/users/login")
          .send({ email, password })
          .then((res) => {
            resolve(res);
          });
      });

      const res = await loginPromise;
      res.should.have.status(401);
      res.body.should.be.a("object");
      res.body.should.have.property("type").eq("not-verified");
      res.body.should.have
        .property("msg")
        .eq("This account has not been verified");
    });
  });

  describe("GET /users/me", () => {
    it("Should return account's details", async () => {
      await createUser(data.verifiedInstitution);
      const { email, password, username } = data.verifiedInstitution;

      const loginPromise = new Promise((resolve, response) => {
        client
          .post("/users/login")
          .send({ email, password })
          .then((res) => {
            resolve(res);
          });
      });
      const loginResponse = await loginPromise;
      const getMePromise = new Promise((resolve, response) => {
        client
          .get("/users/me")
          .set("Authorization", `Bearer ${loginResponse.body.token}`)
          .then((res) => {
            resolve(res);
          });
      });

      const res = await getMePromise;
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("username").eq(username);
      res.body.should.have.property("email").eq(email);
      res.body.should.have.property("role").eq("institution");
    });
  });
});
