ALTER TABLE products
  ADD COLUMN IF NOT EXISTS unit_label TEXT,
  ADD COLUMN IF NOT EXISTS badge_text TEXT,
  ADD COLUMN IF NOT EXISTS has_quantity BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT 'emerald',
  ADD COLUMN IF NOT EXISTS duration_label TEXT,
  ADD COLUMN IF NOT EXISTS bypass_ready BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_pexels TEXT;

INSERT INTO products (name, description, category, price_uzs, unit_label, badge_text, has_quantity, accent_color, is_popular, sort_order, image_pexels) VALUES
-- Funtime.su
('Maneta', 'Funtime.su serveridagi o''yin valyutasi', 'funtime', 1000, '1 000 000 maneta', 'Eng mashhur', true, 'amber', true, 1, '/assets/images/moneta.png'),
('Tokenlar', 'Premium token paketi', 'funtime', 10000, '5 000 token', null, true, 'cyan', true, 2, '/assets/images/token.png'),
('Donat Key', 'Donat sandiqlarini ochish uchun kalit', 'funtime', 25000, '1 Donat Key', 'VIP', true, 'violet', true, 3, '/assets/images/donat_key.png'),
('Token Key', 'Token sandiqlarini ochish uchun kalit', 'funtime', 5000, '1 Token Key', null, true, 'sky', false, 4, '/assets/images/token_key.png'),

-- Minecraft Clients
('Lunar Client Crack', 'Lunar Client Fps Boost va Bedwars Pvp Client', 'client', 35000, '1 oy obuna', 'Top', true, 'violet', true, 1, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/lunar_client.png'),
('Badlion Client Crack', 'Yuqori FPS, capes va premium mods', 'client', 30000, '1 oy obuna', null, true, 'orange', true, 2, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/badlion_client.png'),
('Feather Client', 'Yengil va tez Minecraft clienti', 'client', 25000, '1 oy obuna', null, true, 'pink', false, 3, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/feather_client.png'),
('LabyMod', 'Custom UI, addonlar va capes', 'client', 28000, '1 oy obuna', null, true, 'yellow', false, 4, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/labymod_premium.png'),

-- Minecraft Cheats
('Celestial Client', 'Eng mashhur client. Bypass: NoCheatPlus, Matrix, Vulcan', 'cheat', 250000, null, 'Premium', false, 'violet', true, 1, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/vape_v4.png'),
('Wexside Client', 'Funtime/Reallyworld uchun maxsus moslashtirilgan cheat', 'cheat', 180000, null, 'Funtime ready', false, 'cyan', true, 2, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/novoline.png'),
('DetlaClient', 'Kuchli Anarxiya uchun cheat', 'cheat', 150000, null, null, false, 'red', false, 3, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/rise_7.0.png'),
('Dimasik Client', 'HvH va anarchy cheat', 'cheat', 200000, null, null, false, 'emerald', false, 4, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/exhibition.png'),
('Core Client', 'kuchli pvp modullar va new funksiyalar', 'cheat', 120000, null, null, false, 'violet', false, 5, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/moon_client.png'),
('Nursultan Client', 'Custom build, yangi bypasslar', 'cheat', 90000, null, null, false, 'sky', false, 6, 'C:\Users\yaqqqMUXA\OneDrive\Рабочий стол\Muxa Vault\project\public\assets\images/assets/images/liquidbounce+.png');
