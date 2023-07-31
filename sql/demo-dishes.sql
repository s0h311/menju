------------------------
INSERT INTO public."Restaurant" (name) VALUES ('Batman');
------------------------
INSERT INTO public."DishCategory" (name, picture, "restaurantId") 
  SELECT
  '{ "en": "lunch", "de": "mittagessen", "it": "pranzo" }',
  'https://lenamerz.de/wp-content/uploads/2021/03/schnelle-mittagessen-fuers-homeoffice.jpg',
  "Restaurant".id
FROM public."Restaurant" ORDER BY id DESC;
------------------------
INSERT INTO public."Dish" ("categoryId", name, price, picture, ingredients, labels, nutritions, type, description)
  SELECT
	"DishCategory".id,
	'{ "en": "Doner kebab", "de": "Döner", "it": "Kebab" }',
	6.50,
	'https://www.blog.vegan-masterclass.de/wp-content/uploads/2021/09/Doener_mit_gegrillter_Paprika.jpg',
	  '{
    "required": {
      "en": ["Meat", "Bread", "Salat", "Sauce"],
      "de": ["Fleisch", "Brot", "Salat", "Soße"],
      "it": ["Carne", "Pane", "Insalata", "Salsa"]
    },
    "optional": {
      "en": ["Meat", "Bread", "Salat", "Sauce"],
      "de": ["Fleisch", "Brot", "Salat", "Soße"],
      "it": ["Carne", "Pane", "Insalata", "Salsa"]
    }
  }',
  '{"de": ["Vegan", "Sehr beliebt", "Gibts nur hier", "Geiles Frühstück"], "en": ["Vegan", "Popular", "Only here", "Best Breakfast"], "it": ["Vegan", "Popular", "Only here", "Best Breakfast"]}',
  '{"energy": 560, "protein": 30}',
  'VEGAN',
  '{
  "de": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.",
  "en": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.",
  "it": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
  }'
FROM public."DishCategory" ORDER BY id DESC LIMIT 1;
------------------------
INSERT INTO public."DishCategory" (name, picture, "restaurantId") 
  SELECT
  '{ "en": "dinner", "de": "abendessen", "it": "cena" }',
  'https://images.lecker.de/leichtes-abendessen-b15jpg,id=ef48bb96,b=lecker,w=1600,rm=sk.jpeg',
  "Restaurant".id
FROM public."Restaurant" ORDER BY id DESC;
------------------------
INSERT INTO public."Dish" ("categoryId", name, price, picture, ingredients, labels, nutritions, type, description)
  SELECT
  "DishCategory".id,
  '{ "en": "Pasta", "de": "Nudeln", "it": "Pasta" }',
  9.30,
  'https://www.eatbetter.de/sites/eatbetter.de/files/styles/facebook/public/2021-07/nudeln_mit_kichererbsen_1.jpg?h=4521fff0&itok=C9tS61Im',
  '{
    "required": {
      "en": ["Pasta", "Parmesan", "Tomato sauce"],
      "de": ["Nudeln", "Parmesan", "Tomatensoße"],
      "it": ["Pasta", "Parmigiano", "Salsa di pomodoro"]
    },
    "optional": {
      "en": ["Pasta", "Parmesan", "Tomato sauce"],
      "de": ["Nudeln", "Parmesan", "Tomatensoße"],
      "it": ["Pasta", "Parmigiano", "Salsa di pomodoro"]
    }
  }',
  '{"de": ["Vegan", "Sehr beliebt", "Gibts nur hier", "Geiles Frühstück"], "en": ["Vegan", "Popular", "Only here", "Best Breakfast"], "it": ["Vegan", "Popular", "Only here", "Best Breakfast"]}',
  '{"energy": 560, "protein": 30}',
  'VEGAN',
  '{
  "de": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.",
  "en": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.",
  "it": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
  }'
FROM public."DishCategory" ORDER BY id DESC LIMIT 1;
------------------------
INSERT INTO public."Dish" ("categoryId", name, price, picture, ingredients, labels, nutritions, type, description)
  SELECT
	"DishCategory".id,
	'{ "en": "Pizza", "de": "Pizza", "it": "Pizza" }',
	9.30,
	'https://www.hamburg.de/image/15536634/kingTeaser/990/420/d4e83a1a6365d5c6804a9bf2ccef7fbc/RS/symbolbild-pizza-bild.jpg',
  '{
    "required": {
      "en": ["Dough", "Cheese", "Tomato sauce"],
      "de": ["Teig", "Käse", "Tomatensoße"],
      "it": ["Impasto", "Formaggio", "Salsa di pomodoro"]
    },
    "optional": {
      "en": ["Dough", "Cheese", "Tomato sauce"],
      "de": ["Teig", "Käse", "Tomatensoße"],
      "it": ["Impasto", "Formaggio", "Salsa di pomodoro"]
    }
  }',
  '{"de": ["Vegan", "Sehr beliebt", "Gibts nur hier", "Geiles Frühstück"], "en": ["Vegan", "Popular", "Only here", "Best Breakfast"], "it": ["Vegan", "Popular", "Only here", "Best Breakfast"]}',
  '{"energy": 560, "protein": 30}',
  'VEGAN',
  '{
  "de": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.",
  "en": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.",
  "it": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
  }'
FROM public."DishCategory" ORDER BY id DESC LIMIT 1;
------------------------