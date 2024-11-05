const app = require("../../app")
const request = require("supertest")
process.env.DB_DATABASE = "test_db";

const user1_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNzY5NTg3MX0.KRihalLuUXsrwx0b-ZAXxzmDjAWpDp2MB4wFr6X8V10"
const user2_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODgyMTA5M30.KzMDUG7jQOBSMMaMh0fb8gc3r1fB-Q7TcYO6F9kOLkc"
const invalid_jwt = "ARANDOMSTRINGOFCHARACTERSTHATMAKESNOSENSE"
const no_user_jwt = "STILL NEED TO MAKE ONE"
const request_prefix = "/api/v1"

describe("get /likes/:post_id", () => {
    let post_id = 2
    let apiRequest = (request_prefix + "/likes/" + post_id)
    let response = ""

    it("returns status code 200 if likes were retrieved", async () => {
        response = await request(app.callback())
                              .get(apiRequest)
                              .set("Content-Type", "application/json");

        expect(response.statusCode).toEqual(200);
      }
    );

    //NOT SURE HOW TO TRIGGER THIS IN TESTING
    xit("returns status code 304 if likes are unchanged from cache", async () => {
        response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json");

        expect(response.statusCode).toEqual(304);
      }
    );

    it("returns status code 404 if post was not found", async () => {
        post_id = 0
        apiRequest = (request_prefix + "/likes/" + post_id)
        response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json");

        expect(response.statusCode).toEqual(404);
      }
    );
  }
);

describe("get /likes/private/:post_id", () => {
    let post_id = "2"
    let apiRequest = (request_prefix + "/likes/private/" + post_id)
    let response = ""

    it("returns status code 200 if likes were retrieved", async () => {
        response = await request(app.callback())
                              .get(apiRequest)
                              .set("Content-Type", "application/json")
                              .set('Authorization', `Bearer ${user1_jwt}`);

        expect(response.statusCode).toEqual(200);
      }
    );

    //NOT SURE HOW TO TRIGGER THIS IN TESTING
    xit("returns status code 304 if likes are unchanged from cache", async () => {
        response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

        expect(response.statusCode).toEqual(304);
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

    it("returns status code 404 if like was not found", async () => {
        post_id = "0"
        apiRequest = (request_prefix + "/likes/private/" + post_id)
        response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

        expect(response.statusCode).toEqual(404);
      }
    );
  }
);

describe("post /likes/private/:post_id/:user_id", () => {
  let user_id = "1"
  let post_id = "2"
  let apiRequest = (request_prefix + "/likes/private/" + post_id + "/" + user_id)
  let response = ""

  it("returns status code 201 if like was created", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(201);
    }
  );

  it("returns status code 304 if like already exists", async () => {
      user_id = "1"
      post_id = "1"
      apiRequest = (request_prefix + "/likes/private/" + post_id + "/" + user_id)

      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(304);
    }
  );

  it("returns status code 401 if request wasnt authorized", async () => {
      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${invalid_jwt}`);

      expect(response.statusCode).toEqual(401);
    }
  );

  it("returns status code 403 if request was not permitted", async () => {
      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user2_jwt}`);

      expect(response.statusCode).toEqual(403);
    }
  );

  it("returns status code 404 if post or user was not found", async () => {
      user_id = "0"
      post_id = "0"
      apiRequest = (request_prefix + "/likes/private/" + post_id + "/" + user_id)
      response = await request(app.callback())
                          .post(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});

describe("delete /likes/private/:like_id", () => {
  let like_id = 1
  let apiRequest = (request_prefix + "/likes/private/" + like_id)
  let response = ""

  it("returns status code 200 if user was retrieved", async () => {
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
      like_id = 4
      apiRequest = (request_prefix + "/likes/private/" + like_id)
      response = await request(app.callback())
                          .delete(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user2_jwt}`);

      expect(response.statusCode).toEqual(403);
    }
  );

  it("returns status code 404 if like was not found", async () => {
      like_id = "0"
      apiRequest = (request_prefix + "/likes/private/" + like_id)

      response = await request(app.callback())
                          .delete(apiRequest)
                          .set("Content-Type", "application/json")
                          .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});