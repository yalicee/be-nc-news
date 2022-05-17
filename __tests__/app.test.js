const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("404: responds with not found if given wrong path", () => {
    return request(app)
      .get("/api/megascopics")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("GET /api/articles/:articles_id", () => {
  test("200: responds with article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: "11",
        });
      });
  });
  test("400: responds with bad request if given wrong article_id", () => {
    return request(app)
      .get("/api/articles/article_5")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with invalid filepath if given wrong article_id", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no article found for article_id 99999999");
      });
  });
});

describe("PATCH /api/artices/:articled_id", () => {
  test("201: request body is accepted and responds with updated article, positive increment vote", () => {
    const updatedArticle1 = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle1)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("201: request body is accepted and responds with updated article, negative increment vote", () => {
    const updatedArticle2 = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle2)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("400: incorrect type, responds with bad request ", () => {
    const updatedArticle1 = {
      inc_votes: "string",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle1)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: malformed body / missing required fields, responds with bad request ", () => {
    const updatedArticle1 = {};
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle1)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(4);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds with not found if given wrong path", () => {
    return request(app)
      .get("/api/losers")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});
