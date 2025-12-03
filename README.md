# Bookaholic

Αυτό το project είναι ένα Personal Book Library System. Το σύστημα επιτρέπει στους χρήστες να διαχειρίζονται την προσωπική τους βιβλιοθήκη, να καταγράφουν την πρόοδό τους στην ανάγνωση, να κρατούν σημειώσεις καθώς και να τα βαθμολογούν.

##  Λειτουργίες
- Εγγραφή/Σύνδεση χρήστη
- Προσθήκη νέου βιβλίου
- Επεξεργασία/Διαγραφή βιβλίων
- Αναζήτηση και φιλτράρισμα βιβλίων κατά τίτλο, συγγραφέα ή εκδοτικό οίκο
- Αποθήκευση εικόνας εξωφύλλου
- Βαθμολόγηση και σημειώσεις
## Τεχνολογίες

### Frontend
- React με TypeScript
- Tailwind CSS
- React Router
- Font Awesome
- Vite

## Backend
-Με Java

## Domain Model

### Κύριες Οντότητες
- **User**: Χρήστες συστήματος (id, username, email, password, confirmed password)
- **Book**: Βιβλία που ανήκουν στους χρήστες (id, title, author, publisher, pages, cost, readingStatus, reviewRating, notes, coverImage)

### Σχέσεις
- User 1 <-> N Book (Κάθε βιβλίο ανήκει σε έναν χρήστη)

## Προαπαιτούμενα
- Node.jd
- npm


## Εγκατάσταση και Build

### 1. Clone το repository
```bash
git clone https://github.com/vaggogk/bookaholic-frontend.git