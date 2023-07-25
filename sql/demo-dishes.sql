INSERT INTO public."Restaurant" (name) VALUES ('Batman');

INSERT INTO public."DishCategory" (name, picture, "restaurantId") 
  SELECT
  '{ "EN": "lunch", "DE": "mittagessen", "IT": "pranzo" }',
  'https://lenamerz.de/wp-content/uploads/2021/03/schnelle-mittagessen-fuers-homeoffice.jpg',
  "Restaurant".id
FROM public."Restaurant" ORDER BY id DESC;

INSERT INTO public."DishCategory" (name, picture, "restaurantId") 
  SELECT
  '{ "EN": "dinner", "DE": "abendessen", "IT": "cena" }',
  'https://images.lecker.de/leichtes-abendessen-b15jpg,id=ef48bb96,b=lecker,w=1600,rm=sk.jpeg',
  "Restaurant".id
FROM public."Restaurant" ORDER BY id DESC;

INSERT INTO public."Dish" ("categoryId", name, price, picture, ingredients)
  SELECT
	"DishCategory".id,
	'{ "EN": "Doner kebab", "DE": "Döner", "IT": "Kebab" }',
	6.50,
	'https://www.blog.vegan-masterclass.de/wp-content/uploads/2021/09/Doener_mit_gegrillter_Paprika.jpg',
	'{ "EN": ["Meat", "Bread", "Salat", "Sauce"], "DE": ["Fleisch", "Brot", "Salat", "Soße"], "IT": ["Carne", "Pane", "Insalata", "Salsa"] }'
FROM public."DishCategory" ORDER BY id DESC LIMIT 1;


INSERT INTO public."Dish" ("categoryId", name, price, picture, ingredients)
  SELECT
  "DishCategory".id,
  '{ "EN": "Pasta", "DE": "Nudeln", "IT": "Pasta" }',
  9.30,
  'https://www.eatbetter.de/sites/eatbetter.de/files/styles/facebook/public/2021-07/nudeln_mit_kichererbsen_1.jpg?h=4521fff0&itok=C9tS61Im',
  '{ "EN": ["Pasta", "Parmesan", "Tomato sauce"], "DE": ["Nudeln", "Parmesan", "Tomatensoße"], "IT": ["Pasta", "Parmigiano", "Salsa di pomodoro"] }'
FROM public."DishCategory" ORDER BY id DESC LIMIT 1;

INSERT INTO public."Dish" ("categoryId", name, price, picture, ingredients)
  SELECT
	"DishCategory".id,
	'{ "EN": "Pizza", "DE": "Pizza", "IT": "Pizza" }',
	9.30,
	'https://www.hamburg.de/image/15536634/kingTeaser/990/420/d4e83a1a6365d5c6804a9bf2ccef7fbc/RS/symbolbild-pizza-bild.jpg',
	'{ "EN": ["Dough", "Cheese", "Tomato sauce"], "DE": ["Teig", "Käse", "Tomatensoße"], "IT": ["Impasto", "Formaggio", "Salsa di pomodoro"] }'
FROM public."DishCategory" ORDER BY id DESC LIMIT 1;