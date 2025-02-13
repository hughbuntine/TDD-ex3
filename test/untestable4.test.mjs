import { afterEach, beforeEach, describe, test, expect, vi } from "vitest";
import { PasswordService, PostgresUserDao } from "../src/untestable4.mjs";
import argon2 from "@node-rs/argon2";
import { newDb } from "pg-mem";

describe("PasswordService", () => {
  let service;
  let userDaoMock;

  beforeEach(() => {
    // Mock the User DAO
    userDaoMock = {
      getById: vi.fn(),
      save: vi.fn(),
    };

    // Mock argon2 functions
    vi.spyOn(argon2, "verifySync").mockReturnValue(true);
    vi.spyOn(argon2, "hashSync").mockReturnValue("hashedPassword");

    // Inject mock DAO into the PasswordService
    service = new PasswordService();
    service.users = userDaoMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should change password successfully when old password is correct", async () => {
    // Arrange
    userDaoMock.getById.mockResolvedValue({
      userId: "user123",
      passwordHash: "oldHashedPassword",
    });

    // Act
    await service.changePassword("user123", "oldPassword", "newPassword");

    // Assert
    expect(userDaoMock.getById).toHaveBeenCalledWith("user123");
    expect(argon2.verifySync).toHaveBeenCalledWith("oldHashedPassword", "oldPassword");
    expect(argon2.hashSync).toHaveBeenCalledWith("newPassword");
    expect(userDaoMock.save).toHaveBeenCalledWith({
      userId: "user123",
      passwordHash: "hashedPassword",
    });
  });

  test("should throw an error when old password is incorrect", async () => {
    // Arrange
    userDaoMock.getById.mockResolvedValue({
      userId: "user123",
      passwordHash: "oldHashedPassword",
    });
    argon2.verifySync.mockReturnValue(false); // Simulate incorrect password

    // Act & Assert
    await expect(service.changePassword("user123", "wrongPassword", "newPassword"))
      .rejects.toThrow("wrong old password");

    expect(userDaoMock.save).not.toHaveBeenCalled(); // Ensure save was never called
  });
});


describe("PostgresUserDao", () => {
  let dbInstance;
  let dao;

  beforeEach(async () => {
    // Create an in-memory PostgreSQL database
    dbInstance = newDb();
    const { Pool } = dbInstance.adapters.createPg();

    // Mock the connection
    dao = new PostgresUserDao();
    dao.db = new Pool();

    // Create the users table
    await dao.db.query(`
      CREATE TABLE users (
        user_id TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL
      );
    `);
  });

  afterEach(async () => {
    await dao.close(); // Ensure the database pool is closed
  });

  test("should save a user", async () => {
    // Arrange
    const user = { userId: "user123", passwordHash: "hashedPassword" };

    // Act
    await dao.save(user);
    const result = await dao.getById("user123");

    // Assert
    expect(result).toEqual(user);
  });

  test("should retrieve a user by ID", async () => {
    // Arrange
    await dao.db.query(
      `INSERT INTO users (user_id, password_hash) VALUES ($1, $2)`,
      ["user123", "hashedPassword"]
    );

    // Act
    const user = await dao.getById("user123");

    // Assert
    expect(user).toEqual({ userId: "user123", passwordHash: "hashedPassword" });
  });

  test("should return null for non-existent user", async () => {
    // Act
    const user = await dao.getById("nonExistentUser");

    // Assert
    expect(user).toBeNull();
  });

  test("should update the password for an existing user", async () => {
    // Arrange
    await dao.save({ userId: "user123", passwordHash: "oldHash" });

    // Act
    await dao.save({ userId: "user123", passwordHash: "newHash" });
    const updatedUser = await dao.getById("user123");

    // Assert
    expect(updatedUser.passwordHash).toBe("newHash");
  });
});

