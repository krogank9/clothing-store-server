INSERT INTO users (user_name, password)
VALUES
  ('logan', '$2y$12$l6D6NqNrO5pkN.VV7Tgurer9hrEP/TYQJVqC3uVQ4k4FxQDToU3jK'),
  ('djole', '$2y$12$l6D6NqNrO5pkN.VV7Tgurer9hrEP/TYQJVqC3uVQ4k4FxQDToU3jK'),
  ('maggie', '$2y$12$l6D6NqNrO5pkN.VV7Tgurer9hrEP/TYQJVqC3uVQ4k4FxQDToU3jK'),
  ('sam', '$2y$12$l6D6NqNrO5pkN.VV7Tgurer9hrEP/TYQJVqC3uVQ4k4FxQDToU3jK'),
  ('test', '$2y$12$MtaFGoP9Wqt52Tv3d3jjAeUSjm7.06yOvJS6yCP4XVtFZ7sg0J5Pq');

--passwords = abc123

INSERT INTO collections (name)
VALUES
  ('Shirts'),
  ('Pants'),
  ('Socks'),
  ('Hoodies'),
  ('Bags');

INSERT INTO products (collection_id, name, description, price, stock_s, stock_m, stock_l, stock_xl, stock_xxl)
VALUES
  (1, 'Brown shirt', 'This brown shirt is super comfy! Buy today.', 19.99,
    10, 10, 10, 10, NULL),
  (2, 'Jeans', 'These slim fit jeans are super comfortable.', 24.99,
    10, 10, 10, 10, 10),
  (3, 'Wool Socks', 'Stay warm all winter with these wool socks.', 9.99,
    10, 10, 10, NULL, NULL),
  (4, 'Black Hoodie', 'You can never get enough hoodies! Just buy it.', 19.99,
    10, 10, 10, 10, 10),
  (5, 'Backpack', 'Everyone will love this stylish black blackpack.', 39.99,
    NULL, NULL, 10, NULL, NULL);

INSERT INTO favorites (user_id, product_id)
VALUES
  (5, 1),
  (5, 2),
  (5, 3),
  (5, 4),
  (5, 5);

INSERT INTO reviews (user_id, product_id, rating, headline, content)
VALUES
  (1, 1, 5, 'Good shirt', 'I love this shirt, it''s my new favorite shirt.'),
  (2, 2, 4, NULL, NULL),
  (3, 3, 3, 'Love these socks', 'Wow these socks are the best! They are so warm I don''t even need heating for my house anymore!'),
  (4, 4, 5, 'Best hoodie', 'This hoodie is the best, I''ve worn it for 10 days straight.'),
  (5, 5, 1, 'Awful backpack', 'I hate this backpack, it was so flimsy my dog easily ripped it apart and ate my homework.');