const app = require("../../app")
const request = require("supertest")
process.env.DB_DATABASE = "test_db";

const user1_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNzY5NTg3MX0.KRihalLuUXsrwx0b-ZAXxzmDjAWpDp2MB4wFr6X8V10"
const user2_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODgyMTA5M30.KzMDUG7jQOBSMMaMh0fb8gc3r1fB-Q7TcYO6F9kOLkc"
const invalid_jwt = "ARANDOMSTRINGOFCHARACTERSTHATMAKESNOSENSE"
const no_user_jwt = "STILL NEED TO MAKE ONE"
const request_prefix = "/api/v1"


describe("get /posts/allPosts", () => {
  let apiRequest = (request_prefix + "/posts/allPosts")
  let response = ""

  it("returns status code 200 if posts were retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json");

      expect(response.statusCode).toEqual(200);
    }
  );



  //NEED TO FIND OUT HOW TO DO THIS
  xit("returns status code 304 if posts were unchanged from cache", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json");

      expect(response.statusCode).toEqual(304);
    }
  );

  //NEED TO FIND OUT HOW TO GET THIS TO RETURN NOTHING FROM THE DATABASE
  xit("returns status code 404 if no posts were retrieved", async () => {
    response = await request(app.callback())
                          .get(apiRequest)
                          .set("Content-Type", "application/json");

    expect(response.statusCode).toEqual(404);
    }
  );
});

describe("get /posts/private/allPosts", () => {
  let apiRequest = request_prefix + "/posts/private/allPosts/"
  let response = ""

  it("returns status code 200 if posts were retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );


  
  //NEED TO FIND OUT HOW TO DO THIS
  xit("returns status code 304 if posts were unchanged from cache", async () => {
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

  //NEED TO FIND OUT HOW TO GET THIS TO RETURN NOTHING FROM THE DATABASE
  xit("returns status code 404 if no posts were retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});

describe("get /posts/:post_id", () => {
  let parameter = "2"
  let apiRequest = request_prefix + "/posts/" + parameter
  let response = ""

  it("returns status code 200 if posts were retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );


  
  //NEED TO FIND OUT HOW TO DO THIS
  xit("returns status code 304 if posts were unchanged from cache", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(304);
    }
  );

  it("returns status code 404 if no posts were retrieved", async () => {
      parameter = "0"
      apiRequest = request_prefix + "/posts/private/" + parameter

      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});

describe("get /posts/private/:post_id", () => {
  let parameter = "2"
  let apiRequest = request_prefix + "/posts/private/" + parameter
  let response = ""

  it("returns status code 200 if posts were retrieved", async () => {
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );


  
  //NEED TO FIND OUT HOW TO DO THIS
  xit("returns status code 304 if posts were unchanged from cache", async () => {
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

  it("returns status code 404 if no posts were retrieved", async () => {
      parameter = "0"
      apiRequest = request_prefix + "/posts/private/" + parameter
      response = await request(app.callback())
                            .get(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(404);
    }
  );
});

describe("post /posts/private/:user_id", () => {
  let parameter = "1"
  let apiRequest = request_prefix + "/posts/private/" + parameter
  let body = { post_content: "test content", image_url: "https://picsum.photos/id/235/200/300"}
  let response = ""

  it("returns status code 201 if posts were retrieved", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`)
                            .send(body);

      expect(response.statusCode).toEqual(201);
    }
  );

  it("returns status code 401 if request wasnt authorized", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${invalid_jwt}`)
                            .send(body);

      expect(response.statusCode).toEqual(401);
    }
  );




  //CURRENTLY NO USER DOESNT HAVER PERMS TO POST
  xit("returns status code 403 if request was not permitted", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`)
                            .send(body);

      expect(response.statusCode).toEqual(403);
    }
  );

  it("returns status code 400 if no post_content was found in request", async () => {
      response = await request(app.callback())
                            .post(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`)
                            .send({  });

      expect(response.statusCode).toEqual(400);
    }
  );
});


describe("delete /posts/private/:post_id", () => {
  let parameter = "4"
  let apiRequest = request_prefix + "/posts/private/" + parameter
  let response = ""

  it("returns status code 200 if post was deleted", async () => {
      response = await request(app.callback())
                            .delete(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(200);
    }
  );


  
  //NOT SURE HOW TO TRIGGER THIS SEVER SIDE
  xit("returns status code 304 if the server was unable to delete the post", async () => {
      response = await request(app.callback())
                            .delete(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(304);
    }
  );

  it("returns status code 400 if there was no post to delete", async () => {
      parameter = "0"
      apiRequest = request_prefix + "/posts/private/" + parameter

      response = await request(app.callback())
                            .delete(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(400);
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
      parameter = "3"
      apiRequest = request_prefix + "/posts/private/" + parameter
      response = await request(app.callback())
                            .delete(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user2_jwt}`);

      expect(response.statusCode).toEqual(403);
    }
  );



  //NOT SURE HOW TO TRIGGER THIS SEVER SIDE
  xit("returns status code 422 if server could not process post_id", async () => {
      parameter = "undefined"
      apiRequest = request_prefix + "/posts/private/" + parameter

      response = await request(app.callback())
                            .delete(apiRequest)
                            .set("Content-Type", "application/json")
                            .set('Authorization', `Bearer ${user1_jwt}`);

      expect(response.statusCode).toEqual(422);
    }
  );
});