process.env.NODE_ENV = "test";

const User = require("../models/user");
const Token = require("../models/token");
const server = require("../server");
const data = require("./data");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { createUser } = require("../utils/createuser")

chai.use(chaiHttp);
const client = chai.request.agent(server);
chai.should();

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

      const signupPromise = new Promise((resolve) => {
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

      const loginPromise = new Promise((resolve) => {
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

      const loginPromise = new Promise((resolve) => {
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

      const loginPromise = new Promise((resolve) => {
        client
          .post("/users/login")
          .send({ email, password })
          .then((res) => {
            resolve(res);
          });
      });
      const loginResponse = await loginPromise;
      const getMePromise = new Promise((resolve) => {
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

  describe("PATCH /profile/:id", () => {
    it("Should update user profile", async () => {
      await createUser(data.verifiedInstitution);
      const { email, password } = data.verifiedInstitution;
      const profile = data.updatedProfile;
      const loginPromise = new Promise((resolve) => {
        client
          .post("/users/login")
          .send({ email, password })
          .then((res) => resolve(res));
      });
      const loginResponse = await loginPromise;
      const updateProfilePromise = new Promise((resolve) => {
        client
          .patch(`/users/profile/${loginResponse.body.data.user._id}`)
          .set("Authorization", `Bearer ${loginResponse.body.token}`)
          .send(profile)
          .then((res) => resolve(res));
      });

      const res = await updateProfilePromise;
      res.should.have.status(200);
      res.should.be.a("object");
      res.body.should.have.property("firstname").eq(profile.firstname);
      res.body.should.have.property("lastname").eq(profile.lastname);
      res.body.should.have.property("contact").eq(profile.contact);
      res.body.should.have.property("bio").eq(profile.bio);
      res.body.should.have.property("username").eq(profile.username);
      res.body.should.have.property("address").eq(profile.address);
      res.body.should.have.property("websiteURL").eq(profile.websiteURL);
    });
  });

  describe("GET /users/profile/:id", ()=> {
    it("Should retrieve user profile", async () => {
      await createUser(data.verifiedInstitution);
      const { email, password, username } = data.verifiedInstitution;
      const loginPromise = new Promise((resolve) => {
        client
          .post("/users/login")
          .send({ email, password })
          .then((res) => resolve(res));
      });
      const loginResponse = await loginPromise;
      const getProfilePromise = new Promise((resolve) => {
        client
          .get(`/users/profile/${loginResponse.body.data.user._id}`)
          .set("Authorization", `Bearer ${loginResponse.body.token}`)
          .then((res) => resolve(res));
      });

      const res = await getProfilePromise;
      res.should.have.status(200);
      res.should.be.a("object");
      res.body.should.have.property("username").eq(username);
    });
  });
});
