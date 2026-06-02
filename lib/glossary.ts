/**
 * Słownik pojęć technicznych — źródło definicji dla komponentu <Term>.
 * Klucz = słowo używane w atrybucie word. Wartość = krótka definicja (1-2 zdania).
 * Niski próg wejścia: tłumacz żargon prosto, bez kolejnego żargonu.
 */
export const glossary: Record<string, string> = {
    semantyczny:
        "Kod, który opisuje znaczenie treści, a nie tylko jej wygląd. Np. <nav> mówi 'to nawigacja', a nie po prostu 'to ramka'. Ułatwia czytanie stronie, wyszukiwarkom i czytnikom ekranu.",
    paginacja:
        "Dzielenie dużej liczby wyników na osobne strony (np. po 10 rekordów), żeby nie ładować wszystkiego naraz. Typowe przy listach produktów czy wynikach wyszukiwania.",
    znacznik:
        "Element HTML zapisany w nawiasach ostrokątnych, np. <p> albo <div>. Buduje strukturę strony.",
    atrybut:
        "Dodatkowa informacja w znaczniku HTML, np. href=\"...\" w linku. Zapisywana w otwierającym znaczniku.",
    DOM:
        "Document Object Model — drzewo obiektów reprezentujące stronę w pamięci przeglądarki. JavaScript zmienia stronę, modyfikując DOM.",
    responsive:
        "Strona, która dopasowuje układ do rozmiaru ekranu — inaczej wygląda na telefonie, inaczej na monitorze.",
    walidacja:
        "Sprawdzanie, czy dane są poprawne (np. czy e-mail ma znak @, czy pole nie jest puste) zanim zostaną zapisane lub wysłane.",
    query:
        "Zapytanie do bazy danych — polecenie, które pobiera, dodaje lub zmienia dane, najczęściej w języku SQL.",
    rekord:
        "Pojedynczy wiersz w tabeli bazy danych — np. jeden użytkownik z wszystkimi jego danymi.",
    klucz_obcy:
        "Pole w tabeli, które wskazuje na rekord w innej tabeli. Tak łączy się dane, np. zamówienie z klientem.",
    endpoint:
        "Adres URL, pod który aplikacja wysyła żądanie, żeby coś pobrać lub zapisać. Np. /api/users.",
    framework:
        "Gotowy szkielet do budowy aplikacji — narzuca strukturę i daje gotowe rozwiązania, żeby nie pisać wszystkiego od zera.",
    frontend:
        "Część aplikacji widoczna w przeglądarce — to, z czym użytkownik bezpośrednio klika i co widzi.",
    backend:
        "Część aplikacji działająca na serwerze — logika, baza danych, przetwarzanie danych. Użytkownik jej nie widzi.",
    hosting:
        "Usługa udostępniająca serwer, na którym działa strona lub aplikacja, dostępna w internecie.",
    deploy:
        "Wdrożenie — wrzucenie gotowego kodu na serwer produkcyjny, żeby strona działała publicznie.",
    sesja:
        "Mechanizm pamiętający, że dany użytkownik jest zalogowany między kolejnymi żądaniami do serwera.",
    cookie:
        "Mały plik zapisywany przez stronę w przeglądarce — przechowuje np. informację o zalogowaniu lub preferencjach.",
    SQL:
        "Structured Query Language — język do zarządzania danymi w relacyjnych bazach danych (pobieranie, dodawanie, edycja).",
    PHP:
        "Język programowania działający po stronie serwera, popularny do budowy dynamicznych stron i aplikacji webowych.",
    CRUD:
        "Create, Read, Update, Delete — cztery podstawowe operacje na danych: tworzenie, odczyt, aktualizacja, usuwanie.",
    serwer:
        "Komputer (lub program) dostępny przez internet, który odpowiada na żądania przeglądarki — wysyła strony, przetwarza dane, zapisuje w bazie.",
    HTTP:
        "Protokół komunikacji między przeglądarką a serwerem. Przeglądarka wysyła żądanie (request), serwer odpowiada (response).",
    GET:
        "Metoda HTTP do pobierania danych. Parametry widoczne w URL (np. ?q=html). Używana do wyszukiwania i filtrowania.",
    POST:
        "Metoda HTTP do wysyłania danych. Parametry ukryte w body żądania. Używana do logowania, rejestracji, zamówień.",
    "server-side":
        "Kod wykonywany na serwerze, nie w przeglądarce. Użytkownik widzi tylko wynik (HTML), nie sam kod.",
    "client-side":
        "Kod wykonywany w przeglądarce użytkownika — JavaScript, CSS. Działa bez kontaktu z serwerem.",
    XSS:
        "Cross-Site Scripting — atak polegający na wstrzyknięciu złośliwego kodu JavaScript do strony. Zapobiega mu htmlspecialchars() w PHP.",
    "SQL injection":
        "Atak polegający na wstrzyknięciu złośliwego kodu SQL do zapytania. Zapobiega mu używanie prepared statements.",
    "prepared statements":
        "Sposób budowania zapytań SQL, w którym dane użytkownika są oddzielone od kodu SQL. Chroni przed SQL injection.",
    "wyrażenie regularne":
        "Wzorzec tekstowy do sprawdzania formatu danych, np. czy numer telefonu ma 9 cyfr. W HTML: atrybut pattern.",
    dostępność:
        "Projektowanie stron tak, żeby działały dla wszystkich — w tym dla osób niewidomych (czytniki ekranu), głuchych i z innymi niepełnosprawnościami.",
    "czytnik ekranu":
        "Program zamieniający tekst na mowę lub brajl — używany przez osoby niewidome. Czyta etykiety pól, nagłówki i strukturę strony.",
    "box model":
        "Model pudełkowy CSS — każdy element to prostokąt złożony z: treści, padding (wewnętrzny odstęp), border (ramka) i margin (zewnętrzny odstęp).",
    flexbox:
        "Moduł CSS do układania elementów w jednym kierunku (wiersz lub kolumna). Ułatwia centrowanie i elastyczne rozmieszczanie.",
    grid:
        "Moduł CSS do układania elementów w dwóch kierunkach jednocześnie (wiersze i kolumny). Idealny do budowy layoutów stron.",
    "media query":
        "Reguła CSS, która stosuje style tylko przy określonym rozmiarze ekranu. Podstawa responsywnego designu.",
    "mobile-first":
        "Podejście do projektowania, w którym zaczynasz od wersji mobilnej, a potem dodajesz style dla większych ekranów.",
    JOIN:
        "Operacja SQL łącząca wiersze z dwóch tabel na podstawie wspólnej kolumny. INNER JOIN zwraca tylko pasujące, LEFT JOIN — wszystkie z lewej.",
    "klucz obcy":
        "Kolumna wskazująca rekord w innej tabeli. W tym arkuszu pojazdy.kolor wskazuje kolory.id.",
    "PRIMARY KEY":
        "Klucz główny tabeli — unikalny identyfikator rekordu. Dzięki niemu baza wie, który wiersz jest który.",
    "ORDER BY":
        "Część zapytania SQL ustawiająca kolejność wyników, np. od najdroższych do najtańszych.",
    LIMIT:
        "Część zapytania SQL ograniczająca liczbę zwróconych rekordów, np. tylko pierwsze 2 lub 15.",
    rowspan:
        "Atrybut komórki tabeli HTML, który scala ją pionowo przez kilka wierszy. rowspan=\"2\" oznacza: ta komórka zajmuje dwa wiersze.",
    charset:
        "Zestaw znaków używany do odczytu tekstu. W PHP/MySQL ustawienie utf8 chroni polskie znaki przed krzaczkami.",
    overflow:
        "Właściwość CSS określająca, co zrobić, gdy treść nie mieści się w elemencie. overflow:auto dodaje przewijanie, gdy jest potrzebne.",
    hover:
        "Stan elementu po najechaniu myszką. Na telefonie nie można polegać tylko na hover, bo ekran jest dotykowy.",
    "display: flex":
        "Włącza układ Flexbox dla elementu. Dzieci mogą wtedy ustawiać się w rzędzie lub kolumnie i łatwiej tworzyć równe sekcje.",
    semantyka:
        "Znaczenie elementów w kodzie HTML. Semantyczny kod mówi, czym jest fragment strony, a nie tylko jak wygląda.",
    indeks:
        "Struktura danych w bazie przyspieszająca wyszukiwanie. Jak spis treści w książce — zamiast czytać wszystko, skaczemy od razu do właściwego miejsca.",
    normalizacja:
        "Projektowanie bazy danych tak, żeby te same dane nie powtarzały się w wielu miejscach. Zmniejsza ryzyko niespójności.",
    "async/await":
        "Składnia JavaScript do pisania kodu asynchronicznego (np. pobierania danych z API) w sposób wyglądający jak synchroniczny — bez zagnieżdżonych .then().",
    Promise:
        "Obiekt JavaScript reprezentujący wynik operacji, która jeszcze się nie zakończyła (np. żądanie sieciowe). Może być spełniony (resolved) lub odrzucony (rejected).",
    fetch:
        "Wbudowana funkcja JavaScript do wysyłania żądań HTTP z przeglądarki. Zwraca Promise z odpowiedzią serwera.",
    JSON:
        "JavaScript Object Notation — tekstowy format wymiany danych. Wygląda jak obiekt JS: {\"klucz\": \"wartość\"}. Używany w API.",
    API:
        "Application Programming Interface — zestaw reguł, przez które dwa programy rozmawiają ze sobą. Np. przeglądarka pyta serwer o dane przez API.",
};
