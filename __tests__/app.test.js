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
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
  test("404: responds with not found if given wrong path", () => {
    return request(app)
      .get("/api/megascopics")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
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
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with invalid filepath if given wrong article_id", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
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
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("400: malformed body / missing required fields, responds with bad request ", () => {
    const updatedArticle1 = {};
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle1)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
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
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("404: responds with not found if given wrong path", () => {
    return request(app)
      .get("/api/losers")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("GET /api/articles", () => {
  describe("should work with sort_by, order and topic queries", () => {
    test("200: should respond with array sorted by article_id, order defaults to descending", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy("article_id", { descending: true });
        });
    });
    test("200: should respond with array ordered by ascending, sort_by defaults to created_at", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });
    test("200: should respond with array of one cat article object when filtered by topic cats", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(1);
          expect(articles[0]).toEqual(
            expect.objectContaining({
              article_id: 5,
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              comment_count: "2",
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
    test("200: for multiple queries, should respond with an array of mitch article objects, sorted by article_id with order ascending", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy("article_id", { ascending: true });
          articles.forEach((article) => expect(article.topic).toBe("mitch"));
        });
    });
    test("400: stops invalid sort_by queries and responds with bad request", () => {
      return request(app)
        .get("/api/articles?sort_by=quantity")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request: cannot sort by 'quantity'");
        });
    });
    test("400: stops invalid order queries and responds with bad request", () => {
      return request(app)
        .get("/api/articles?order=rupaul")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(
            "bad request: cannot order by 'rupaul', ASC or DESC only"
          );
        });
    });
    test("400: stops invalid filter types and responds with bad request", () => {
      return request(app)
        .get("/api/articles?positive=10")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });
  });

  test("200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("404: responds with not found if given wrong path", () => {
    return request(app)
      .get("/api/barnacles")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 1,
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("400: responds with bad request if given wrong article_id data type", () => {
    return request(app)
      .get("/api/articles/article_5/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with invalid filepath if given wrong article_id", () => {
    return request(app)
      .get("/api/articles/99999999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("no comments found for article_id 99999999");
      });
  });
  test("404: responds with not found if given wrong filepath", () => {
    return request(app)
      .get("/api/articles/1/commentttss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: request body is accepted and responds with the posted comment object", () => {
    const newComment = {
      username: "icellusedkars",
      body: "you are not good at writing news articles",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject(
          expect.objectContaining({
            article_id: 1,
            author: "icellusedkars",
            body: "you are not good at writing news articles",
            comment_id: 19,
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("400: incorrect username responds with bad request ", () => {
    const newComment = {
      username: "pumpkin",
      body: "laura ate some dollar pizza",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("400: malformed body / missing required fields, responds with bad request ", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("400: invalid article_id, responds with bad request ", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/9999999/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("400: invalid body type, responds with bad request ", () => {
    const newComment = {
      username: "icellusedkars",
      body: 420,
    };
    return request(app)
      .post("/api/articles/9999999/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status: 204, responds with an empty body", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: resource does not exist, responds with not found", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("no comment found for comment_id 999999");
      });
  });
  test("400: invalid comment_id, responds with bad request ", () => {
    return request(app)
      .delete("/api/comments/id_no_8")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});
