# KOMA: Spirit Delivery
## Vollständiges Projektbriefing

**Dokumenttyp:** Game Design & Development Briefing  
**Projektstatus:** Browser-Prototyp, Visual Build 0.6  
**Letzte dokumentierte Version:** 0.6  
**Sprache des Spiels:** Deutsch (erste Version)  
**Genre:** Casual Puzzle / Command-Planning  
**Plattform-Ziel:** Desktop-Browser, später optional mobil  
**Visuelle Richtung:** Isometrisch wirkender, schräger Blick auf einen magischen japanischen Garten mit Cyberpunk-Akzenten

---

## 1. Projektübersicht

**KOMA: Spirit Delivery** ist ein gemütliches, stilisiertes Puzzle-Spiel. Die Spielerin oder der Spieler steuert einen kleinen Lieferroboter namens KOMA durch eine magische, futuristisch inspirierte japanische Gartenwelt. Das Ziel besteht darin, einen Lieferauftrag zu erfüllen, indem vorab eine Folge von Befehlen zusammengestellt und anschließend abgespielt wird.

Das Spiel soll leicht zugänglich wirken, zugleich aber zum Vorausplanen und Problemlösen anregen. Die Präsentation verbindet warme Laternenbeleuchtung, Kirschblüten, Steinwege, Wasserflächen und traditionelle japanische Architektur mit cyanfarbenen und violetten Leuchteffekten.

**Wichtiges Entwicklungsprinzip:** Zuerst müssen Grafik, Kamera-Perspektive, Bedienung und Kernmechanik zuverlässig funktionieren. Erst danach sollen zusätzliche Levels, Schwierigkeitskurven und größere Spielsysteme ausgebaut werden.

## 2. Vision und Spielerlebnis

Das Spiel soll folgende Gefühle vermitteln:

- **Gemütlichkeit:** Eine ruhige, märchenhafte Gartenwelt bei Nacht.
- **Neugier:** Kleine Wege, Tore, Schalter und Umgebungsdetails laden zum Erkunden ein.
- **Klarheit:** Die Befehle und Regeln sind leicht verständlich.
- **Befriedigung:** Eine gut geplante Befehlsfolge führt KOMA erfolgreich ans Ziel.
- **Charakter:** KOMA soll als niedlicher, wiedererkennbarer Lieferroboter im Mittelpunkt stehen.

Die Grafik soll nicht wie ein flaches Debug-Grid oder ein grober Platzhalter-Prototyp aussehen. Das Ziel ist eine zusammenhängende Spielwelt mit Tiefe, Licht, Texturen und klar lesbaren interaktiven Objekten.

## 3. Zielplattform und technische Grundlage

### Aktueller Ansatz

- Das Spiel läuft als HTML-Datei mit CSS und JavaScript.
- Die aktuelle Projektversion befindet sich in `koma_spirit_delivery_v04/index.html`.
- Die Schreingarten-Textur liegt als `shrine_texture.jpg` im Projektordner.
- Eine ZIP-Version des Projekts wurde als `koma_spirit_delivery_visual_build_06.zip` bereitgestellt.
- Die Kernmechanik und die Leveldaten sollen bei reinen Grafikänderungen möglichst unverändert bleiben.

### Technische Leitlinien

1. Das Spiel muss lokal im Browser startbar sein.
2. Externe Abhängigkeiten sollen möglichst vermieden werden, damit das Projekt einfach weitergegeben werden kann.
3. Alle verwendeten Texturen und Grafiken müssen mit dem Projekt mitgeliefert oder zuverlässig eingebettet werden.
4. Die Spiellogik soll von der Darstellung getrennt bleiben, soweit es die bestehende Implementierung erlaubt.
5. Jede Änderung an der Darstellung muss gegen die vorhandene Steuerung getestet werden.
6. Keine grafische Änderung darf unbeabsichtigt Kollisionen, Bewegungen, Tore, Schalter oder Levelwechsel verändern.

## 4. Kern-Gameplay

### Grundprinzip

Die Spielfigur bewegt sich auf einem Raster. Die Spielerin oder der Spieler stellt eine Folge von Befehlen zusammen und lässt KOMA diese Befehle anschließend nacheinander ausführen.

### Befehle

| Kürzel | Deutscher Name | Funktion |
|---|---|---|
| `F` | Vorwärts | KOMA bewegt sich ein Feld in Blickrichtung. |
| `L` | Links drehen | KOMA dreht sich um 90 Grad nach links. |
| `R` | Rechts drehen | KOMA dreht sich um 90 Grad nach rechts. |
| `A` | Aktion / Interagieren | KOMA aktiviert einen Schalter, wenn es sich auf dem entsprechenden Feld befindet. |

### Spielregeln

- KOMA kann sich nicht außerhalb des Spielfeldes bewegen.
- KOMA kann nicht durch Wände oder andere blockierende Felder laufen.
- Ein geschlossenes Tor blockiert die Bewegung.
- Steht KOMA auf einem Schalter und führt `A` aus, wird das zugehörige Tor geöffnet.
- Das Ziel gilt als erreicht, wenn KOMA das Zielfeld betritt beziehungsweise die Zielfeldprüfung nach einem Befehl erfolgt.
- Jedes Level hat ein maximales Befehlslimit.
- Ein Befehl `A` auf einem Feld ohne aktivierbares Objekt soll keine unbeabsichtigte Zustandsänderung auslösen und sollte eine verständliche Rückmeldung geben.

### Qualitätsanforderungen an die Mechanik

- Die Ausrichtung von KOMA muss bei Drehungen und Bewegungen stets korrekt sein.
- Die Darstellung der Blickrichtung muss mit der Spiellogik übereinstimmen.
- Ein Reset muss Position, Blickrichtung, Torzustände, Ergebniszustand und Wiedergabe zurücksetzen.
- Die Befehlsfolge darf die erlaubte Anzahl an Befehlen nicht überschreiten.
- Während eine Befehlsfolge abgespielt wird, dürfen keine widersprüchlichen Eingaben zu einem inkonsistenten Zustand führen.
- Sieg- und Fehlermeldungen müssen zuverlässig und verständlich erscheinen.
- Nach einem Levelabschluss muss ein Neustart oder der Wechsel zum nächsten Level möglich sein.

## 5. Visuelle Richtung

### 5.1 Kamera und Perspektive

Die Kamera soll **nicht rein von oben** auf das Spielfeld schauen. Gewünscht ist ein leicht erhöhter, schräger beziehungsweise isometrisch wirkender Blickwinkel.

Die Perspektive soll Tiefe vermitteln, ohne die Orientierung im Raster zu erschweren. Die Wege und begehbaren Felder müssen weiterhin eindeutig erkennbar sein.

**Wichtig:** Eine CSS-Transformation kann eine schräge Anmutung erzeugen, ist aber keine echte 3D-Kamera. Wenn später eine echte isometrische Welt mit individuell platzierten Modellen und korrekter Tiefensortierung benötigt wird, muss die Darstellung entsprechend weiterentwickelt werden.

### 5.2 Art Direction

**Stil:** Cozy Fantasy trifft Cyberpunk-Japan.

Zentrale Bildelemente:

- Japanischer Schreingarten bei Nacht
- Kirschblüten und Blütenblätter
- Moosige Steinwege und Steinmauern
- Bäume und üppige Vegetation
- Warme Papierlaternen
- Wasserflächen, kleine Wasserfälle und Teiche
- Kleine Brücken und Holzgeländer
- Torii-Tore und Schreine
- Cyanfarbene und violette magische Mechanismen
- Leuchtende Schalter und Zielmarkierungen
- Dunkelblaue Schatten, warmes Orange und Magenta als Akzentfarben

### 5.3 Oberflächen und Materialien

Die Welt soll nicht flach wirken. Jede wichtige Oberfläche braucht erkennbare Materialeigenschaften:

- **Stein:** Unterschiedliche Steinplatten, sichtbare Kanten, Fugen, Moos und leichte Farbvariationen.
- **Bäume:** Stamm, mehrere Volumenebenen der Baumkrone, Schatten und gelegentliche Kirschblüten.
- **Wasser:** Dunkle Blau- und Türkistöne, Reflexionen, kleine Lichtpunkte und möglichst dezente Bewegung.
- **Holz:** Sichtbare Bretter, dunkle Kanten und warme Lichtreflexe.
- **Metall / Magie:** Cyan- oder violette Leuchtkanten und ein kontrollierter Glow.
- **Laternen:** Warmes Licht mit kleinem Lichtschein auf angrenzenden Oberflächen.

### 5.4 Tiefe und Beleuchtung

Um den Eindruck eines fertigen Spiels zu erzeugen, sollen folgende Mittel kombiniert werden:

- Kontakt- und Bodenschatten unter Objekten
- Seitliche Kanten an Steinplatten
- Mehrere Ebenen bei Bäumen und Dekoration
- Warme Lichtinseln um Laternen
- Kühle Umgebungsbeleuchtung
- Zurückhaltende Leuchteffekte an Schaltern, Toren und Ziel
- Dezente Partikel wie Blütenblätter
- Unterschiedliche Helligkeit zwischen Vordergrund und Hintergrund

Effekte dürfen die Lesbarkeit nicht beeinträchtigen. Insbesondere muss KOMA auf dem Spielfeld immer klar sichtbar bleiben.

## 6. Spielfeld und Umgebungsobjekte

### 6.1 Begehbare Felder

Begehbare Felder sollen als Steinweg oder Plattformen dargestellt werden. Die Felder sollen sich optisch voneinander unterscheiden, aber weiterhin ein klares Raster bilden. Dezente Variation bei Textur, Fugen und Moos ist erwünscht.

### 6.2 Bäume als Hindernisse

Die bisherigen blockartigen Hindernisse sollen visuell durch Bäume beziehungsweise größere Vegetation ersetzt werden, wo dies zur Levelgeometrie passt.

Anforderungen:

- Bäume müssen deutlich höher als die Bodenfläche wirken.
- Die Baumkronen sollen mehrere Blätter- oder Blütenebenen besitzen.
- Ein sichtbarer Stamm oder eine dunkle Basis soll die Verbindung zum Boden herstellen.
- Schatten sollen die Bäume auf dem Weg verankern.
- Die Baumgrafiken dürfen nicht die Position von KOMA, Schaltern, Toren oder Ziel verdecken.
- Die Kollision bleibt unabhängig von der Baumgrafik: Ein als Wand definiertes Feld bleibt blockiert.
- Bäume sollten über mehrere Levels konsistent gestaltet werden, dürfen aber in Form und Blütenfarbe leicht variieren.

### 6.3 Tore

- Tore sollen wie magische Schreintore oder futuristische Torii-Mechanismen wirken.
- Geschlossene Tore müssen deutlich als Hindernis erkennbar sein.
- Geöffnete Tore brauchen einen klar sichtbaren Zustandswechsel.
- Violette oder cyanfarbene Leuchteffekte können den magischen Charakter betonen.
- Die visuelle Darstellung muss exakt mit dem `open`-Zustand der Spielmechanik synchronisiert sein.

### 6.4 Schalter

- Schalter sollen als eigenständige, leuchtende Bodenplatten dargestellt werden.
- Ein klar erkennbares Symbol zeigt, dass sie interaktiv sind.
- Aktivierte Schalter sollen ihren Zustand sichtbar ändern.
- Die Farbe sollte sich von Boden, Ziel und Tor unterscheiden.

### 6.5 Ziel

- Das Ziel soll als goldene oder orangefarbene Leuchtplatte dargestellt werden.
- Es soll sich deutlich vom cyanfarbenen Schalter unterscheiden.
- Ein dezenter Puls- oder Glow-Effekt ist erwünscht.
- Der erfolgreiche Abschluss muss zusätzlich durch eine UI-Meldung signalisiert werden.

### 6.6 Wasser, Brücken und Dekoration

Wasser, Brücken, Laternen, Zierpflanzen und Schreine gehören zur gewünschten späteren Ästhetik. Sie können zunächst dekorativ sein und müssen keine eigene Spielmechanik besitzen.

Dekoration muss von blockierenden Feldern unterscheidbar bleiben. Sie darf nicht den Eindruck erwecken, dass ein Feld begehbar ist, wenn es tatsächlich blockiert ist.

## 7. Charakterdesign: KOMA

KOMA ist ein kleiner, freundlicher Lieferroboter.

### Erscheinungsbild

- Heller, weißer oder cremefarbener Körper
- Große, leuchtend cyanfarbene Augen
- Kleine Antenne oder sensorisches Element
- Kleines Lieferpaket
- Kompakte, runde Silhouette
- Leichte Schatten und sichtbares Volumen

### Animation und Orientierung

- KOMA soll sich entsprechend der Blickrichtung drehen.
- Bewegungen sollen flüssig, aber schnell genug für ein Puzzle-Spiel sein.
- Eine leichte Bewegung oder ein kurzer Effekt bei erfolgreicher Interaktion ist möglich.
- Während der Wiedergabe muss die Figur exakt auf den Spielfeldpositionen bleiben.
- Animationen dürfen nicht dazu führen, dass KOMA optisch auf einem anderen Feld als in der Spiellogik steht.

## 8. Benutzeroberfläche

Die Benutzeroberfläche soll die Stimmung der Welt aufnehmen, aber die Bedienung nicht erschweren.

### Hauptbereiche

1. **Logo / Titel:** KOMA: Spirit Delivery.
2. **Levelinformation:** Levelnummer und Titel.
3. **Aufgabenbeschreibung:** Kurze Erklärung des aktuellen Ziels und des Befehlslimits.
4. **Befehlsauswahl:** Vorwärts, links drehen, rechts drehen, Aktion.
5. **Befehlsfolge:** Sichtbare Slots für die programmierten Befehle.
6. **Zurücksetzen:** Setzt den aktuellen Durchlauf zurück.
7. **Plan abspielen:** Führt die Befehlsfolge aus.
8. **Statusmeldung:** Zeigt Erfolg, Fehler oder Hinweise an.

### UI-Stil

- Dunkle, leicht transparente Panels
- Abgerundete Ecken
- Dezente Rahmen und Schatten
- Cyan als Hauptakzent
- Violett für magische Elemente
- Warmes Gold für Ziel und Erfolg
- Gut lesbare Schriftgrößen und Kontraste

### Responsive Darstellung

- Auf Desktop soll das Spielfeld möglichst viel Platz einnehmen.
- Die Befehlssteuerung soll kompakt und gut erreichbar sein.
- Auf kleineren Displays müssen Panels und Spielfeld neu angeordnet werden, ohne wichtige Bedienelemente abzuschneiden.
- Die Perspektive darf sich auf mobilen Geräten nicht so stark verzerren, dass die Feldpositionen unklar werden.

## 9. Aktueller Stand und Versionshistorie

### Visual Build 0.4

- Überarbeitete Darstellung von KOMA und Spielfeld.
- Dunkler Cyber-Japan-Look mit cyanfarbenen und violetten Akzenten.
- Grundlegende CSS- und SVG-Visuals.
- Zehn Level sind in der Datei vorhanden.

### Visual Build 0.5

- Erste Weiterentwicklung der schrägen Perspektive.
- Einbindung einer Schreingarten-Textur als Hintergrund.
- Überarbeitung der visuellen Stimmung.

### Visual Build 0.6

- Weiterentwicklung der Darstellung von Hindernissen in Richtung Bäume und Vegetation.
- Weitere optische Tiefe durch Schatten, Kanten und Leuchteffekte.
- Beibehaltung der bestehenden Spielmechanik und Leveldefinitionen als Ziel der Änderung.

**Statushinweis:** Es wurden Syntaxprüfungen durchgeführt, aber ein vollständiger automatisierter Browser- und visueller Regressionstest wurde in der bisherigen Umgebung nicht zuverlässig abgeschlossen. Der tatsächliche Zustand muss deshalb beim Weiterentwickeln im Browser erneut geprüft werden. Frühere Aussagen zur Lösbarkeit der Level sollten nicht als Ersatz für einen vollständigen Testlauf im aktuellen Build verstanden werden.

## 10. Aktuelle Levelstruktur

Das Projekt enthält derzeit zehn Leveldefinitionen. Die Geometrie und Schwierigkeit sollen vorerst nicht grundlegend verändert werden, während Grafik und Spielabläufe stabilisiert werden.

| Level | Rastergröße | Befehlslimit |
|---|---:|---:|
| 1 | 5 × 5 | 8 |
| 2 | 5 × 5 | 8 |
| 3 | 6 × 6 | 8 |
| 4 | 6 × 6 | 9 |
| 5 | 6 × 6 | 10 |
| 6 | 6 × 6 | 11 |
| 7 | 6 × 6 | 12 |
| 8 | 6 × 6 | 13 |
| 9 | 6 × 6 | 14 |
| 10 | 6 × 6 | 16 |

Die Level enthalten je nach Definition Startposition und Blickrichtung, Zielposition, Wände sowie bei späteren Levels Schalter und Tore.

**Priorität:** Erst die bestehenden Levels zuverlässig und visuell sauber darstellen. Neue Levels und die Feinabstimmung des Schwierigkeitsgrads folgen danach.

## 11. Entwicklungsprioritäten

### Priorität 1 – Funktion und Stabilität

- Alle Befehle zuverlässig ausführen.
- Kollisionen, Wände und Spielfeldgrenzen prüfen.
- Schalter und Tore auf korrekten Zustandswechsel testen.
- Reset und erneutes Spielen prüfen.
- Siegbedingungen und Fehlermeldungen überprüfen.
- Keine visuellen Änderungen ohne Funktionstest übernehmen.

### Priorität 2 – Grafische Umsetzung

- Baum- und Vegetationsgrafiken in den tatsächlichen Spielfeld-Renderer integrieren.
- Steinwege mit Materialstruktur und Tiefe ausarbeiten.
- Die schräge Perspektive stabil und responsiv gestalten.
- KOMA plastischer darstellen und sauber auf den Feldern verankern.
- Tore, Schalter und Ziel visuell voneinander unterscheiden.
- Texturhintergrund und Spielfeld so abstimmen, dass die Welt zusammenhängend wirkt.
- Dekoration und Partikeleffekte ergänzen, ohne die Lesbarkeit zu verschlechtern.

### Priorität 3 – Benutzeroberfläche und Feedback

- Befehlsfolge verständlich darstellen.
- Wiedergabestatus sichtbar machen.
- Erfolgs- und Fehlermeldungen überarbeiten.
- Bedienung bei Maus und Touch prüfen.
- Layout für unterschiedliche Fenstergrößen testen.

### Priorität 4 – Testen und Optimieren

- Jedes Level mit einem Solver oder gezielten Testfällen prüfen.
- Die gefundenen Lösungen im echten Spiel nachspielen.
- Grafiken auf Überlagerungen und falsche Tiefenreihenfolge prüfen.
- Performance und Ladezeiten kontrollieren.
- Eine stabile Version mit allen benötigten Dateien paketieren.

### Priorität 5 – Spätere Erweiterungen

Erst nach Abschluss der vorherigen Punkte:

- Neue Levels
- Ausbalancierte Schwierigkeitskurve
- Weitere Hindernistypen und Interaktionen
- Zusätzliche Animationen
- Musik und Soundeffekte
- Speichern des Fortschritts
- Mobile Optimierung und mögliche spätere Veröffentlichung

## 12. Testplan

Jede veröffentlichte Version soll mindestens diese Prüfungen durchlaufen:

### Mechaniktests

- [ ] Vorwärtsbewegung in alle vier Richtungen
- [ ] Links- und Rechtsdrehung
- [ ] Bewegung an allen Spielfeldrändern
- [ ] Kollision mit Wänden
- [ ] Kollision mit geschlossenem Tor
- [ ] Öffnen eines Tores mit Aktion auf dem Schalter
- [ ] Aktion ohne interaktives Objekt
- [ ] Ziel erreicht
- [ ] Befehlslimit erreicht oder überschritten
- [ ] Reset nach einem unvollständigen Durchlauf
- [ ] Reset nach einem Sieg
- [ ] Mehrfaches Abspielen einer Befehlsfolge
- [ ] Levelwechsel

### Grafiktests

- [ ] KOMA ist auf allen Bodenflächen gut sichtbar.
- [ ] Blickrichtung und Bewegung stimmen überein.
- [ ] Bäume verdecken keine wichtigen interaktiven Objekte.
- [ ] Tore zeigen den korrekten Zustand.
- [ ] Schalter und Ziel sind leicht unterscheidbar.
- [ ] Die Perspektive bleibt bei verschiedenen Fenstergrößen lesbar.
- [ ] UI-Elemente überdecken keine entscheidenden Spielbereiche.
- [ ] Texturdateien werden lokal zuverlässig geladen.
- [ ] Keine Grafikfehler oder unerwarteten Überlagerungen.
- [ ] Animationen beeinträchtigen die Steuerung nicht.

### Paket- und Starttests

- [ ] ZIP-Datei lässt sich fehlerfrei entpacken.
- [ ] Alle benötigten Assets sind enthalten.
- [ ] `index.html` startet lokal im Browser.
- [ ] Keine fehlenden Dateien oder Ressourcen.
- [ ] JavaScript-Syntaxprüfung erfolgreich.
- [ ] Vollständiger Test im echten Browser dokumentiert.

## 13. Definition of Done für die aktuelle Entwicklungsphase

Die aktuelle Phase gilt erst dann als abgeschlossen, wenn:

1. die vorhandene Spielmechanik zuverlässig funktioniert,
2. alle zehn Level korrekt geladen und dargestellt werden,
3. die schräge Perspektive das Spielfeld räumlicher erscheinen lässt,
4. die bisherigen Blockhindernisse passend durch Bäume oder Vegetation visualisiert sind,
5. Wege, Bäume, Tore, Schalter und Ziel klar unterscheidbar sind,
6. die UI lesbar und bedienbar bleibt,
7. die Grafiken und Texturen im ZIP enthalten sind,
8. ein echter Browser-Test durchgeführt und dokumentiert wurde.

## 14. Zusammenarbeit und Arbeitsweise

Das Projekt soll iterativ entwickelt werden. Für jede neue Version gilt:

1. Bestehenden Code und Assets prüfen.
2. Nur die für den aktuellen Schritt notwendigen Änderungen vornehmen.
3. Die Spielmechanik bei grafischen Änderungen nicht unnötig umbauen.
4. Syntax und wichtige Spielfunktionen prüfen.
5. Wenn möglich, im Browser testen.
6. Einschränkungen und noch nicht getestete Funktionen transparent dokumentieren.
7. Eine vollständige ZIP-Datei mit allen benötigten Ressourcen bereitstellen.

Die Person hinter dem Projekt möchte möglichst wenig selbst programmieren. Die Umsetzung soll daher überwiegend durch den Assistenten erfolgen. Erklärungen und notwendige manuelle Schritte sollen klar, knapp und nachvollziehbar beschrieben werden.

## 15. Leitentscheidung

**Der nächste Arbeitsschritt ist die konsequente Umsetzung der isometrisch wirkenden Spielwelt im tatsächlichen Spielcode.** Keine weiteren reinen Konzeptbilder als Ersatz für die Implementierung.

Die Grafik soll sich sichtbar in Richtung der Referenz entwickeln: Bäume statt grober Seitenblöcke, strukturierte Steinwege, stimmungsvolle Beleuchtung, Wasser und Holzdetails, plastischere Tore und Schalter sowie eine konsistente, schräge Kameraperspektive. Danach folgt ein systematischer Browser-Test, bevor neue Levels oder eine veränderte Schwierigkeit geplant werden.

---

## Projektdateien

Die zuletzt dokumentierten Dateien sind:

- `index.html` – Spiel und Spielmechanik
- `shrine_texture.jpg` – Schreingarten-Hintergrundtextur
- `koma_spirit_delivery_visual_build_06.zip` – Projektpaket

Dateinamen und Versionsstände sind als Dokumentationsstand zu verstehen. Vor Änderungen sollte immer die tatsächlich aktuelle Datei geprüft werden.
