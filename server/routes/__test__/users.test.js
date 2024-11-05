const app = require("../../app")
const request = require("supertest")
const base_64 = require("base-64")
process.env.DB_DATABASE = "test_db";

const user1_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNzY5NTg3MX0.KRihalLuUXsrwx0b-ZAXxzmDjAWpDp2MB4wFr6X8V10"
const user2_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODgyMTA5M30.KzMDUG7jQOBSMMaMh0fb8gc3r1fB-Q7TcYO6F9kOLkc"
const invalid_jwt = "ARANDOMSTRINGOFCHARACTERSTHATMAKESNOSENSE"
const no_user_jwt = "STILL NEED TO MAKE ONE"
const request_prefix = "/api/v1"

function BasicEncode(username, password) {
  return base_64.encode(`${username}:${password}`)
}

describe("get /users", () => {
  let apiRequest = (request_prefix + "/users")
  let response = ""

  it("returns status code 200 if users were retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );

  it("returns status code 401 if request wasnt authorized", async () => {
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${invalid_jwt}`);

      expect(response.statusCode).toEqual(401);
    }
  );

  it("returns status code 403 if request was not permitted", async () => {
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user2_jwt}`);

      expect(response.statusCode).toEqual(403);
    }
  );
});

describe("get /users/getjwt/:username", () => {
  let username = "user1"
  let password = "123"
  let apiRequest = (request_prefix + "/users/getjwt/" + username)
  let response = ""
  let basicAuth = ""

  it("returns status code 200 if jwt was retrieved", async () => {
      basicAuth = BasicEncode(username, password)

      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Basic ${basicAuth}`);

      expect(response.statusCode).toEqual(200);
    }
  );

  it("returns status code 401 if request wasnt authorized", async () => {
      basicAuth = BasicEncode("user123", "12356")

      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Basic ${basicAuth}`);

      expect(response.statusCode).toEqual(401);
    }
  );

  it("returns status code 404 if user was not found", async () => {
      basicAuth = BasicEncode(username, password)

      username = "THISUSERDOESNTEXIST"
      apiRequest = (request_prefix + "/users/getjwt/" + username)

      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Basic ${basicAuth}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});

describe("get /users/byId/:id", () => {
  let user_id = "1"
  let apiRequest = (request_prefix + "/users/byId/" + user_id)
  let response = ""

  it("returns status code 200 if user was retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );

  it("returns status code 401 if request wasnt authorized", async () => {
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${invalid_jwt}`);

      expect(response.statusCode).toEqual(401);
    }
  );

  it("returns status code 403 if request was not permitted", async () => {
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user2_jwt}`);

      expect(response.statusCode).toEqual(403);
    }
  );

  it("returns status code 404 if no post was found", async () => {
      user_id = "0"
      apiRequest = (request_prefix + "/users/byId/" + user_id)
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});

describe("get /users/byUsername/:username", () => {
  let username = "user1"
  let apiRequest = (request_prefix + "/users/byUsername/" + username)
  let response = ""

  it("returns status code 200 if user was retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );

  it("returns status code 401 if request wasnt authorized", async () => {
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${invalid_jwt}`);

      expect(response.statusCode).toEqual(401);
    }
  );

  it("returns status code 403 if request was not permitted", async () => {
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user2_jwt}`);

      expect(response.statusCode).toEqual(403);
    }
  );

  it("returns status code 404 if no post was found", async () => {
      username = "nouser"
      apiRequest = (request_prefix + "/users/byUsername/" + username)
      response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});

describe("post /users/create/user", () => {
  let body = {
    username: "userfortesting",
    password: "testing",
    role: "user"
  }
  let apiRequest = (request_prefix + "/users/create/user")
  let response = ""

  it("returns status code 201 if user was created", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .send(body);

      expect(response.statusCode).toEqual(201);
    }
  );

  it("returns status code 304 if user already exists", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .send(body);

      expect(response.statusCode).toEqual(304);
    }
  );

  it("returns status code 400 if no body was found", async () => {
      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .send({  });

      expect(response.statusCode).toEqual(400);
    }
  );

  it("returns status code 403 if request was not permitted", async () => {
      body = {
        username: "userfortesting1",
        password: "testing",
        role: "admin"
      }

      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .send(body);

      expect(response.statusCode).toEqual(403);
    }
  );
});

describe("post /users/create/admin", () => {
  let body = {
    username: "adminfortesting",
    password: "testing",
    role: "admin"
  }
  let apiRequest = (request_prefix + "/users/create/admin")
  let response = ""

  it("returns status code 201 if user was created", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`)
                            .send(body);

      expect(response.statusCode).toEqual(201);
    }
  );

  it("returns status code 304 if user already exists", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`)
                            .send(body);

      expect(response.statusCode).toEqual(304);
    }
  );

  it("returns status code 400 if no body was found", async () => {
      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user1_jwt}`)
                          .send({  });

      expect(response.statusCode).toEqual(400);
    }
  );

  it("returns status code 401 if request was not authorized", async () => {
      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${invalid_jwt}`)
                          .send(body);

      expect(response.statusCode).toEqual(401);
    }
  );

  it("returns status code 403 if request was not permitted", async () => {
      body = {
        username: "adminfortesting1",
        password: "testing",
        role: "admin"
      }

      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user2_jwt}`)
                          .send(body);

      expect(response.statusCode).toEqual(403);
    }
  );
});

describe("delete /users/:user_id", () => {
  let user_id = "3"
  let apiRequest = (request_prefix + "/users/" + user_id)
  let response = ""

  it("returns status code 200 if user was deleted", async () => {
      response = await request(app.callback())
                            .delete(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );

  it("returns status code 401 if request wasnt authorized", async () => {
      response = await request(app.callback())
                          .delete(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${invalid_jwt}`);

      expect(response.statusCode).toEqual(401);
    }
  );

  it("returns status code 403 if request was not permitted", async () => {
      user_id = "2"
      apiRequest = (request_prefix + "/users/" + user_id)

      response = await request(app.callback())
                          .delete(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user2_jwt}`);

      expect(response.statusCode).toEqual(403);
    }
  );

  it("returns status code 404 if user did not exist", async () => {
      user_id = "100"
      apiRequest = (request_prefix + "/users/" + user_id)

      response = await request(app.callback())
                          .delete(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});