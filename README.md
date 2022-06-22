<h2 align="center">HumanToSql</h2>

<br>

## Wymagana wiedza

- SQL, Node, JS

## Technologie potrzebne do zadania

- [Dowolna technologia z tego linku](https://www.prisma.io/dataguide/database-tools/top-nodejs-orms-query-builders-and-database-libraries#waterline)

## Cele główne

- [ ] Stwórz aplikację umożliwiającą pisanie zapytań SQL-owych jako ciąg funkcji w formie tekstu

Przykład takiego zapytania: "from("users_docker").getAll().where("name = "Azor"")".

- Przykład takiego zapytania: 'select(["id","name","surname"]).from("users_docker").getAll().where("name = "Azor"")'
  // getAll / getChoosen
  // getCosTam powinno być po from('users_docker')
- Przetumaczone zapytanie SQL-owe : select \* from pieski where name = Azor

* Lista słów SQL-owych którą powinien wspierać twój program:
* [x] insert
* [????] create table (jaki input ma dawać user? Raczej nie będzie dawał informacji, że kolumna firstName ma typ varchar(255), co jest wymagane przy tworzeniu tabeli)
* [x] select
* [x] from
* [x] add
* [x] distinct
* [x]update
* [x]delete
* [x]truncate
* [x] by xYZ asc
* [x] by XYZ desc
* [x] where
* [x] and
* [x] or
* [x] not
* [x] group by

## Cele opcjonalne do wykonania

- [ ] Stwórz prosty interfejs graficzny który umożliwia wykonywanie zapytań

## Przydatne linki

- Jak działają dane zapytania w sql-u: https://www.educba.com/sql-keywords/
