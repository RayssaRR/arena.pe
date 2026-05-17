BEGIN;

INSERT INTO users (id, name, email, password, role)
VALUES (
  UNHEX(REPLACE('3d6f0f78-4f2e-4b3a-9a6f-0f7b7c9d2c11', '-', '')),
  'Admin',
  'admin@arena.pe',
  '$2a$10$lWsFsZDg/ye8rlVCJXOqxuikbp11g2q8oVYzcKOJnaTeEIO33Yppi',
  'ADMIN'
);

COMMIT;