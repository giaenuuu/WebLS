[Back](./README.md)

# WebLS

Das Projekt WebLs zielt darauf hin, den Windows-File Explorer mithilfe des "ls" Kommando-Zeilen-Befehls in einer Web-Applikation umzusetzen.

## Login

Um einen Benutzer erfolgreich anzumelden, sucht der Server mittels ORM und SQL den Benutzer mit dem Benutzernamen, welcher der Benutzer eingegeben hat, aus der Datenbank. Wenn der Benutzer gefunden wurde, wird zum eingegebenen Passwort das Salt, welches auch in der Datenbank unter dem Benutzer gespeichert ist, hinzugefügt und anschliessend mit `sha256` gehasht. Zum Schluss wird überprüft, ob der Hash in der Datenbank und der eben erstellt übereinstimmen und anhand dieser Information wird im Anschluss, bei einer Übereinstimmung das Login erfolgen. Sollte es nicht übereinstimmen oder einer der vorherigen Schritte einen Fehler aufweisen, wird eine Fehlermeldung zurückgegeben und im Frontend (Client) werden die Eingabefelder zurückgesetzt. <br>
SQL-Injektion z.B. beim Passwort wird durch das ORM `Sequalize`, welches wir verwenden, verhindert.
XSS wird automatisch von Angular verhindert, sofern man als Entwickler nicht [innerHtml] verwendet.

## Registrierung

## Session

Sessions werden nach einem erfolgreichen Login (Benutzername und Passwort) ausgestellt und zur Persistenz im Frontend (Client) in den "Cookies" als neuer Eintrag mit dem Session-Token gespeichert. Die Session ist nur während der Laufzeit des Servers (Backend) gültig, da diese "in-memory" gespeichert wird. Die "in-memory" Session auf dem Server besteht aus einer GUID (Session-Token), welche zur Identifikation und Unterscheidung verschiedener Sessions gebraucht wird, der Benutzer ID, welche gebraucht wird, um die Session einem Benutzer zuweisen zu können und einem Ablaufdatum, welches dazu gebraucht wird, die Session automatisch zu deaktivieren, sobald eine Anfrage mit einer abgelaufenen Session gemacht wird. Dies führt zu mehr Sicherheit, da sich der Benutzer nach dem Ablaufen einer Session neu anmelden muss und so auch eine gestohlene Session nicht für immer brauchbar ist.

## Systemkommando

Der LS-Befehl wird im Backend als sogenanntes Data-Transfer-Object (DTO) erwartet, welches als Erstes bei einer Anfrage auf korrekte Typisierung überprüft und allenfalls bereits einen Fehler wirft. <br>
Dies hat den Vorteil, dass bei fixen Datentypen wie z.B. Boolean's oder Enum's bereits keine Kommando-Injektion mehr möglich ist. Das DTO ist somit bereits bis auf den Pfad (path), welcher "plain" Text ist, validiert. <br>
Um diesen zu validieren, muss der Pfad mit dem fest programmierten Anfang "/home/{homedir}" übereinstimmen und darf keine Zeichen der selbst definierten Blacklist enthalten, wie z. B. "../" oder ";". <br>
Danach wird der Pfad mittels des "shell-quote" `Node.js`Moduls "escaped", um sicherzustellen, dass der Pfad, falls er immer noch schädliche Zeichen beinhalten sollte,"unschädlich" gemacht wird.
Final wird mithilfe des vorinstallierten "file system" (fs) Moduls von `Node.js` überprüft, ob der Pfad, welcher mit "ls" aufgerufen werden soll, überhaupt existiert.
<br><br>
Im Anschluss wird aus dem jetzt komplett validierten DTO das Systemkommando erstellt. Ein Beispiel dafür wäre "cd {path};ls -FlXar --full-time".
<br><br>
Zum Abschluss wird das Resultat zum View-DTO gemappt und zurück ans Frontend gesendet.
<br><br>
Auch hier gilt, dass wenn ein Fehler oder etwas Invalides auftreten sollte, der Server einen Fehler an den Client zurückmeldet.

## Log

Die zwei Log-Dateien `log.txt` und `errors.txt` enthalten die entsprechenden Logs, welche der Server (Backend) während seiner Laufzeit ausgibt. Dabei wird zwischen "normalen" Logs (debug, log, warn, verbose) und "error" Logs (error, fatal) unterschieden. Ein Log kann vom Server selbst oder durch "manuelle" Programmierung z.B. bei einem Fehler in einer Controller/Server-Methode erstellt werden. Neu geschriebene Logs werden mithilfe des vorinstallierten "file system" (fs) Moduls von `Node.js` direkt in die jeweilige Log-Datei geschrieben.

## Passwortsicherung

Passwörter werden in der Applikation nur für die Benutzerauthentifizierung gebraucht und werden somit auch nur in der User-Tabelle der MySQL-Datenbank gespeichert. Zur sicheren Passwortverwahrung werden Passwörter aber nicht als "plain" Text in die Datenbank gespeichert, sondern werden zuerst mit einem sogenannten Salt versehen, welcher aus einer GUID besteht und pro Benutzer anders ist, und im Anschluss noch mit `sha256` gehasht, bevor diese mit dem dazugehörigen Salt in der Datenbank persistiert werden.

## Verschlüsselung
