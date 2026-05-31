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
    "responsive":
        "Strona, która dopasowuje układ do rozmiaru ekranu — inaczej wygląda na telefonie, inaczej na monitorze.",
    walidacja:
        "Sprawdzanie, czy dane są poprawne (np. czy e-mail ma znak @, czy pole nie jest puste) zanim zostaną zapisane lub wysłane.",
    "query":
        "Zapytanie do bazy danych — polecenie, które pobiera, dodaje lub zmienia dane, najczęściej w języku SQL.",
    rekord:
        "Pojedynczy wiersz w tabeli bazy danych — np. jeden użytkownik z wszystkimi jego danymi.",
    klucz_obcy:
        "Pole w tabeli, które wskazuje na rekord w innej tabeli. Tak łączy się dane, np. zamówienie z klientem.",
    "endpoint":
        "Adres URL, pod który aplikacja wysyła żądanie, żeby coś pobrać lub zapisać. Np. /api/users.",
    "framework":
        "Gotowy szkielet do budowy aplikacji — narzuca strukturę i daje gotowe rozwiązania, żeby nie pisać wszystkiego od zera.",
    "frontend":
        "Część aplikacji widoczna w przeglądarce — to, z czym użytkownik bezpośrednio klika i co widzi.",
    "backend":
        "Część aplikacji działająca na serwerze — logika, baza danych, przetwarzanie danych. Użytkownik jej nie widzi.",
    "hosting":
        "Usługa udostępniająca serwer, na którym działa strona lub aplikacja, dostępna w internecie.",
    "deploy":
        "Wdrożenie — wrzucenie gotowego kodu na serwer produkcyjny, żeby strona działała publicznie.",
    sesja:
        "Mechanizm pamiętający, że dany użytkownik jest zalogowany między kolejnymi żądaniami do serwera.",
    "cookie":
        "Mały plik zapisywany przez stronę w przeglądarce — przechowuje np. informację o zalogowaniu lub preferencjach.",
    "SQL":
        "Structured Query Language — język do zarządzania danymi w relacyjnych bazach danych (pobieranie, dodawanie, edycja).",
    "PHP":
        "Język programowania działający po stronie serwera, popularny do budowy dynamicznych stron i aplikacji webowych.",
    "CRUD":
        "Create, Read, Update, Delete — cztery podstawowe operacje na danych: tworzenie, odczyt, aktualizacja, usuwanie."
};
