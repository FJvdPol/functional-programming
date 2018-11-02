# Functional Programming
Currently: way to communicate with the OBA Api
## install
clone or download this repository and navigate to it with your console
```
npm install
```

## Van tevoren
### mogelijke toepassing
Laten zien welke boeken er aanwezig zijn per vestiging -> Als ik nu naar OBA oosterdok ga, welke boeken zijn daar dan aanwezig?

### Stappenplan
[X] 1. Connectie Api
[X] 2. Uitpluizen data
[X] 3. Interessante variabelen
[X] 4. Onderzoeksvragen
[x] 5. Uiteindelijke onderzoeksvraag
[X] 6. Deelvragen
[X] 7. Benodigde variabelen
[] 8.

## Onderzoek

### Interessante variabelen:
- publicatiedatum
- locaties
- toevoegdatum
- coverafbeelding (kleuren?)
- talen
- uitgevers?
- schrijvers?
- genre

- jeugd video ?

### Mogelijke onderzoeksvragen
1. Is er na een toename van toegevoegde boeken in een week een toename in aantal geleende boeken vlak na deze periode?
  - Welke dag van de week worden de meeste boeken toegevoegd?
  - Welke dag van de week worden de meeste boeken uitgeleend?
  NIET UITVOERBAAR
2. Wat is de verhouding van talen tussen alle boeken?
 - vertalingen
 - hoeveelheden
3. Van alle boekcovers, welke kleur komt het meeste voor?
 -
4. Wat is de ontwikkeling van de verhouding van talen waarin oba boeken zijn geschreven van boeken in de afgelopen 20 jaar
  - alle boeken van de afgelopen 20 jaar publicatie
  - verhouding talen per publicatiejaar
  - genre?
  - iets met vertalingen?
5. Waarde van een collectie boeken (bijv. harry potter)
 - Amazon scraper?
 - marktplaats scraper?
6. Lengte samenvattingen boeken in bepaalde categorie door de laatste publicatiejaren heen

### Uiteindelijke onderzoeksvraag
Hoe is de verhouding tussen Nederlandse schoolboeken en schoolboeken oorspronkelijk geschreven in andere talen gedurende de afgelopen 10 jaar veranderd?
- Hoeveel schoolboeken zijn er in de OBA collectie die in de afgelopen 10 jaar geschreven?
- Wat is de verhouding van geschreven talen in de schoolboeken per publicatiejaar?

### Benodigde variabelen
- genre (school)
- publicatiejaar (2007 - 2017)
- original-language

nog te bepalen: Tel ik de in principe geschreven taal of tellen vertalingen ook mee?

bepaalt: kijken naar alleen de originele taal

### Momenteel bezig met
Dataverzameling inrichten om alleen de boeken van 2007 - 2017 te verkrijgen





### Stappenlog
1. Connectie met de api van oba gemaakt
2. script van rijk uitgeplozen en herschreven
3. filter parameter gemaakt die alleen de values van specifieke keys terug geeft (als je alleen titels wil krijg je alleen titel objecten terug)
4. response data van Oba uitgeplozen
5. getAll functie geschreven, vrij instabiel -> zoekterm 'harry potter' is 11 get requests, 'boek' is 22.000 requests. Responses van laatstgenoemde verwerken werd mn werkgeheugen niet blij van
