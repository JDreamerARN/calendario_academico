-- Script para inserir dados de teste no banco de dados
-- Execute este script no MySQL para criar usuários e eventos de teste

USE eventos_academicos;

-- Limpar dados existentes (opcional)
DELETE FROM event_members;
DELETE FROM events;
DELETE FROM users;

-- Resetar auto-increment
ALTER TABLE event_members AUTO_INCREMENT = 1;
ALTER TABLE events AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Inserir usuários de teste
INSERT INTO users (username, email, phone, password, registration_number, user_type, approved) VALUES
('admin', 'admin@teste.com', '11999999999', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'ADM001', 'ADMINISTRADOR', true),
('professor1', 'prof1@teste.com', '11888888888', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'PROF001', 'PROFESSOR', true),
('professor2', 'prof2@teste.com', '11777777777', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'PROF002', 'PROFESSOR', true),
('aluno1', 'aluno1@teste.com', '11666666666', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'ALU001', 'ALUNO', true),
('aluno2', 'aluno2@teste.com', '11555555555', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'ALU002', 'ALUNO', true),
('aluno3', 'aluno3@teste.com', '11444444444', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'ALU003', 'ALUNO', true),
('aluno4', 'aluno4@teste.com', '11333333333', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'ALU004', 'ALUNO', true),
('aluno5', 'aluno5@teste.com', '11222222222', '\$2a\$10\$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2', 'ALU005', 'ALUNO', true);

-- Inserir eventos de teste
-- Evento 1: Prova de Matemática (criada pelo professor1)
INSERT INTO events (title, description, event_type, date, created_by) VALUES
('Prova de Matemática', 'Prova sobre álgebra linear e geometria analítica', 'PROVA', '2025-06-28 14:00:00', 2);

-- Evento 2: Trabalho de Programação (criado pelo professor2)
INSERT INTO events (title, description, event_type, date, created_by) VALUES
('Trabalho de Programação', 'Desenvolvimento de aplicação web com React e Spring Boot', 'TRABALHO', '2025-06-30 16:00:00', 3);

-- Evento 3: Festa de Integração (criada pelo aluno1)
INSERT INTO events (title, description, event_type, date, created_by) VALUES
('Festa de Integração', 'Festa para comemorar o fim do semestre e integrar a turma', 'FESTA', '2025-06-29 19:00:00', 4);

-- Evento 4: Prova de Física (criada pelo professor1)
INSERT INTO events (title, description, event_type, date, created_by) VALUES
('Prova de Física', 'Prova sobre mecânica clássica e termodinâmica', 'PROVA', '2025-07-02 10:00:00', 2);

-- Evento 5: Trabalho de Banco de Dados (criado pelo professor2)
INSERT INTO events (title, description, event_type, date, created_by) VALUES
('Trabalho de Banco de Dados', 'Modelagem e implementação de banco de dados relacional', 'TRABALHO', '2025-07-05 14:00:00', 3);

-- Evento 6: Festa Junina (criada pelo aluno2)
INSERT INTO events (title, description, event_type, date, created_by) VALUES
('Festa Junina', 'Festa junina tradicional com comidas típicas e quadrilha', 'FESTA', '2025-07-06 18:00:00', 5);

-- Adicionar membros aos eventos
-- Prova de Matemática: todos os alunos
INSERT INTO event_members (event_id, user_id) VALUES
(1, 4), (1, 5), (1, 6), (1, 7), (1, 8);

-- Trabalho de Programação: alunos 1, 2, 3
INSERT INTO event_members (event_id, user_id) VALUES
(2, 4), (2, 5), (2, 6);

-- Festa de Integração: todos os alunos e professores
INSERT INTO event_members (event_id, user_id) VALUES
(3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8);

-- Prova de Física: alunos 1, 2, 4, 5
INSERT INTO event_members (event_id, user_id) VALUES
(4, 4), (4, 5), (4, 7), (4, 8);

-- Trabalho de Banco de Dados: alunos 3, 4, 5
INSERT INTO event_members (event_id, user_id) VALUES
(5, 6), (5, 7), (5, 8);

-- Festa Junina: todos os alunos
INSERT INTO event_members (event_id, user_id) VALUES
(6, 4), (6, 5), (6, 6), (6, 7), (6, 8);

-- Mostrar os dados inseridos
SELECT 'Usuários criados:' as info;
SELECT id, username, email, user_type, approved FROM users;

SELECT 'Eventos criados:' as info;
SELECT id, title, event_type, date, created_by FROM events;

SELECT 'Membros dos eventos:' as info;
SELECT e.title, u.username, u.user_type 
FROM event_members em 
JOIN events e ON em.event_id = e.id 
JOIN users u ON em.user_id = u.id 
ORDER BY e.id, u.username;

-- Credenciais para teste:
-- Admin: admin / 123456
-- Professor1: professor1 / 123456
-- Professor2: professor2 / 123456
-- Aluno1: aluno1 / 123456
-- Aluno2: aluno2 / 123456
-- Aluno3: aluno3 / 123456
-- Aluno4: aluno4 / 123456
-- Aluno5: aluno5 / 123456 