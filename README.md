# Book Reading List Application

A reading list app where you add books, mark them as read and track your progress. Built in Lecture 11 and part of my portfolio: https://github.com/Naman-Chandak

**Live app:** https://book-reading-list-app-three.vercel.app

## Features

- Add a book with a title and an author
- Mark a book as read or unread, and delete it
- Filter the shelf: All, To read or Read
- Live count of total books and books read
- Your list is saved in the browser (`localStorage`), so it is still there after a refresh
- Clear messages for empty fields, duplicate books and an empty shelf
- Works on phones and desktops

## Technologies

HTML, CSS, JavaScript (no libraries). Pixel fonts: Press Start 2P and VT323 (SIL Open Font License), included in `assets/fonts`.

## How it works

1. The form checks that both fields are filled in and that the book is not already on the list.
2. A new book is stored as an object (`id`, `title`, `author`, `read`) in an array.
3. Every change saves the array to `localStorage` and redraws the list.
4. The filter buttons decide which books `render()` shows.
5. Book text is inserted with `textContent`, so anything typed into the form is shown as plain text and never run as code.

## Run it locally

No install needed. Download the folder and double-click `index.html`.

## Limits

The list is saved only in the browser you used. A different browser or device starts with an empty shelf.

## Updates

- Added the deployed link to this README.
