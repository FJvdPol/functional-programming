# Functional Programming
Currently: way to communicate with the OBA Api
## install
clone or download this repository and navigate to it with your console
```
npm install
```



## Onderzoek

### Interessante data:
- publicatiedatum
- locaties
- toevoegdatum
- coverafbeelding (kleuren?)
- talen


### leuke vragen

1. Is er na een toename van toegevoegde boeken in een week een toename in aantal geleende boeken vlak na deze periode?
  - Welke dag van de week worden de meeste boeken toegevoegd?
  - Welke dag van de week worden de meeste boeken uitgeleend?
2. Wat is de verhouding van talen tussen alle boeken?





### mogelijke toepassing
Laten zien welke boeken er aanwezig zijn per vestiging -> Als ik nu naar OBA oosterdok ga, welke boeken zijn daar dan aanwezig?


### Stappen
1. Connectie met de api van oba gemaakt
2. script van rijk uitgeplozen en herschreven
3. filter parameter gemaakt die alleen de values van specifieke keys terug geeft (als je alleen titels wil krijg je alleen titel objecten terug)
4. response data van Oba uitgeplozen
5. getAll functie geschreven, vrij instabiel -> zoekterm 'harry potter' is 11 get requests, 'boek' is 22.000 requests. Responses van laatstgenoemde verwerken werd mn werkgeheugen niet blij van
