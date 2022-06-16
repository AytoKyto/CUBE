import { createMocks } from "node-mocks-http";
import { addItemToDB } from "../methods/db.add";
import { updateItem } from "../methods/db.update";
import { connect } from "../methods/db.connect";
import { deleteItem } from "../methods/db.delete";
import { getItemById } from "../methods/db.getById";
import { getAll } from "../methods/db.getAll";

describe("DB Methods - Get All Items from a collection", () => {
  //   function mockRequestResponse(method = "GET") {
  //     const { req, res } = createMocks({ method });
  //     req.headers = {
  //       "Content-Type": "application/json",
  //     };
  //     req.query = {};
  //     return { req, res };
  //   }

  it("should return data if method is GET", async () => {
    const { res } = createMocks({ method: "GET" });

    await getAll("categories");
    expect(res.statusCode).toBe(200);
  });

  it("should confirm creation if method is POST", async () => {
    //const { req, res } = mockRequestResponse("POST");

    const { res } = createMocks({ method: "POST" });
    await getAll("test");

    expect(res.statusCode).toBe(201);
  });

  it("should return a 404 if type is not recognized", async () => {
    await getAll("test");

    expect(res.statusCode).toBe(404);
  });
});
