BEGIN;

INSERT INTO users (id, name, email, password, role)
VALUES (
  UNHEX(REPLACE('3d6f0f78-4f2e-4b3a-9a6f-0f7b7c9d2c11', '-', '')),
  'Admin',
  'admin@arena.pe',
  '$2a$10$lWsFsZDg/ye8rlVCJXOqxuikbp11g2q8oVYzcKOJnaTeEIO33Yppi',
  'ADMIN'
);

-- Inserir categorias de eventos
INSERT INTO categories (title, description) VALUES
('Show', 'Shows musicais, apresentações de artistas e performances'),
('Esportes', 'Eventos esportivos diversos: futebol, voleibol, basquete'),
('Tour', 'Tours e visitas guiadas ao estádio'),
('Conferência', 'Conferências, palestras e eventos corporativos'),
('Treinamento', 'Treinos abertos, clínicas e workshops esportivos'),
('Festival', 'Festivais, feiras e eventos culturais'),
('Casamento', 'Eventos privados e celebrações'),
('Outro', 'Outros tipos de eventos não classificados');

COMMIT;