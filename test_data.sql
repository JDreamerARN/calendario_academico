-- Script para inserir dados de teste no banco de dados
-- Execute este script no MySQL para criar usuários e eventos de teste
-- Todas as senhas dos usuários de teste são: 123456

USE calendario;

-- Limpar dados existentes (opcional)
DELETE FROM comments;
DELETE FROM event_tags;
DELETE FROM event_members;
DELETE FROM events;
DELETE FROM users;

-- Resetar auto-increment
ALTER TABLE comments AUTO_INCREMENT = 1;
ALTER TABLE event_members AUTO_INCREMENT = 1;
ALTER TABLE events AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Inserir usuários de teste (sem papéis nem aprovação)
INSERT INTO users (username, email, phone, password) VALUES
('maria', 'maria@teste.com', '11999999999', '$2a$10$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2'),
('joao', 'joao@teste.com', '11888888888', '$2a$10$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2'),
('ana', 'ana@teste.com', '11777777777', '$2a$10$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2'),
('pedro', 'pedro@teste.com', '11666666666', '$2a$10$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2'),
('clara', 'clara@teste.com', '11555555555', '$2a$10$/dmn3G08t6FSZYAAn3YJ6OvLwGMrCdSvjpwf6EkhqOfOxRpbOfQW2');

-- Inserir eventos de teste (com cor; criados por usuários diferentes)
INSERT INTO events (title, description, color, date, created_by) VALUES
('Reunião de planejamento', 'Alinhamento das próximas entregas do time', '#1976d2', '2026-07-01 14:00:00', 1),
('Aniversário da Ana', 'Comemoração com bolo e amigos', '#d32f2f', '2026-07-05 19:00:00', 3),
('Treino de corrida', 'Corrida leve no parque', '#388e3c', '2026-07-03 07:00:00', 4),
('Viagem de fim de semana', 'Planejamento da viagem para a serra', '#f57c00', '2026-07-12 09:00:00', 2);

-- Tags dos eventos (coleção de textos livres)
INSERT INTO event_tags (event_id, tag) VALUES
(1, 'trabalho'), (1, 'reunião'),
(2, 'festa'), (2, 'pessoal'),
(3, 'saúde'), (3, 'esporte'),
(4, 'viagem'), (4, 'lazer');

-- Participantes dos eventos
INSERT INTO event_members (event_id, user_id) VALUES
-- Reunião de planejamento (criada por maria): joao e ana
(1, 2), (1, 3),
-- Aniversário da Ana (criado por ana): maria, joao, pedro, clara
(2, 1), (2, 2), (2, 4), (2, 5),
-- Treino de corrida (criado por pedro): clara
(3, 5),
-- Viagem de fim de semana (criada por joao): maria e clara
(4, 1), (4, 5);

-- Comentários de teste
INSERT INTO comments (content, event_id, author_id, created_at) VALUES
('Confirmo presença!', 1, 2, '2026-06-28 10:00:00'),
('Posso levar o que?', 2, 1, '2026-06-28 11:30:00'),
('Bora! Levo a água.', 3, 5, '2026-06-28 12:15:00');

-- Mostrar os dados inseridos
SELECT 'Usuários criados:' as info;
SELECT id, username, email FROM users;

SELECT 'Eventos criados:' as info;
SELECT id, title, color, date, created_by FROM events;

SELECT 'Tags dos eventos:' as info;
SELECT event_id, tag FROM event_tags ORDER BY event_id;

SELECT 'Membros dos eventos:' as info;
SELECT e.title, u.username
FROM event_members em
JOIN events e ON em.event_id = e.id
JOIN users u ON em.user_id = u.id
ORDER BY e.id, u.username;

-- Credenciais para teste (todas com senha: 123456):
-- maria / 123456
-- joao / 123456
-- ana / 123456
-- pedro / 123456
-- clara / 123456
