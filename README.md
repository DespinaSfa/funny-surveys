# PartyPoll

## Description of the project
Party Poll ist eine Umfrage App für Partys. Es kann zwischen 3 verschiedenen Umfragen gewählt werden: Wedding, Party, Planning:
- "Wedding" ist für deine Hochzeit. Woher kennen deine Gäste dich? Was war dein Highlight der Hochzeit? 
- "Party" ist für ein Stimmungsbild während deiner Party. Welche Songs müssen unbedingt noch gespielt werden? Wie ist dein aktueller Alkoholpegel? Was ist deine Lieblingsaktivität auf der Party?
- "Planning" ist dafür da, um deine nächstes Event zu planen. Bekomme ein allgemeines Stimmungsbild deiner Gäste, um dir die Planung zu erleichtern
 </br>
 </br>
Um eine Umfrage (Poll) zu erstellen musst du eingeloggt sein. Nach dem erfolgreichen login siehst du dein Dashboard mit all deinen Polls und einer allgemeinen Statistik über deine bisherigen Umfragen. Außerdem kannst du deine bisherigen Polls verwalten (löschen, link kopieren, QR - Code erneut herunterladen). Um eine Umfrage zu erstellen, klicke auf den "Add Poll" Button. Wähle zwischen einem der drei Poll-Typen aus. Wenn du dir ein Poll ausgesucht hast, gib dem Poll einen Titel und eine Beschreibung. Schau dir dann die Fragen in dem Poll an. Passt alles? Dann klicke auf den "Generate Poll" Button. Dein Poll wird erstellt und du kannst einen praktischen QR Code herunterladen. Diesen QR Code können deine Gäste dann scannen und den Poll ausfüllen, natürlich ohne sich anzumelden. Nachdem deine Gäste den Poll ausgefüllt haben, können Sie auch die Antworten der anderen nutzer sehen, natürlich anonym. 

## Team Members 
- Tom Bestvater | tb173 | 43097
- Emma Zimmermann | ez019 | 42762
- Maik Bucher | mb389 | 42687
- Johanna Rauscher | jr132 | 42959
- Luca v. Kannen | lv042 | 43394
- Despina Sfantou | ds215 | matnr

## Getting started
1. Clone das Projekt und stell sicher, dass du auf dem "main" branch bist. 
2. Starte das Projekt mit "docker compose up" (Hinweis: Stell sicher, dass Docker Desktop bzw Docker Deamon läuft)
3. Öffne die App unter http://localhost:3000
4. Verwende diese Nutzerdaten, um auf ein Profil mit Beispieldaten zuzugreifen: 
    - Username: User2
    - Passwort: User2
5. Verwende diese Nutzerdaten, um auf ein leeres Profil zuzugreifen: 
    - Username: User1
    - Passwort: User1
6. Fertig!
7. Hinweis: Nach jedem Neustart wird die Datenbank zurückgesetzt. Damit das nicht mehr der Fall ist, muss im Backend `db/db_operations.go` in der Funktion `populateDatabase()` "Drop all tables" gelöscht und "Check if the database is empty by checking for existing users" wieder auskommentiert werden.

## Testing
### Frontend
- Cypress e2e and component test
- Run `npm run test-e2e` and `npm run test-component` to start the tests
- e2e test: Einloggen -> Erstellen eines Polls -> Ausloggen 
    - Unter: cypress -> e2e
- component test : MultipleChoiceSelector + UserHandlerComponent (Dropdown Button im Header) 
    - Unter cycpress -> component

### Backend
- Run `go test server` and `go run db` to start the tests
- e2e test: Für alle CRUD Operationen 
    - server/routes_test.go
- unit test: Für Datenbank
    - db/db_operations_test.go

## Tech - Stack
### Fronend
- React

### Backend
- Go
- Postgres Database

## License
This is a project developed in an HdM course