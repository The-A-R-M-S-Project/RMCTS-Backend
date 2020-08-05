process.env.NODE_ENV = "test";

const User = require("../models/user");
const Item = require("../models/item");
const server = require("../server");
const data = require("./data");
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const { createUser } = require("../utils/createuser");

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

  describe("POST /equipment/item", () => {
    it("Should add new item", async () => {
      const { verifiedInstitution, item1, image1 } = data;
      const { email, password } = verifiedInstitution;
      createUser(verifiedInstitution);

      const loginPromise = new Promise((resolve) => {
        client
          .post("/users/login")
          .send({ email, password })
          .then((res) => resolve(res));
      });

      const loginResponse = await loginPromise;
      const addItemPromise = new Promise((resolve) => {
        client
          .post("/equipment/item")
          .set("Authorization", `Bearer ${loginResponse.body.token}`)
          .field("_id", item1._id)
          .field("title", item1.title)
          .field("location", item1.location)
          .field("description", item1.description)
          .attach("image", image1, image1.split("/")[-1])
          .then((res) => resolve(res));
      });

      const res = await addItemPromise;
      res.should.have.status(201);
      res.should.be.a("object");
      res.body.should.have.property("title").eq(item1.title);
      res.body.should.have.property("description").eq(item1.description);
      res.body.should.have.property("location").eq(item1.location);
      res.body.should.have.property("imageURL");
      res.body.should.have.property("imageID");
    });
  });
});
