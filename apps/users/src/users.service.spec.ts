import { UsersService } from "./users.service";

describe("UsersService", () => {
  it("creates and finds a user", () => {
    const service = new UsersService();
    const user = service.create({
      email: "john@example.com",
      name: "John Doe",
    });

    expect(user.id).toBeDefined();
    expect(service.findOne(user.id)).toEqual(user);
  });
});
