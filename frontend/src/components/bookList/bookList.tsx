import React from 'react'
import BookSummary from '../bookSummary/bookSummary'

interface Book {
  id: number,
  title: string,
  authors: string[],
  publisher: string,
  edition: number,
  publicationYear?: number,
  copiesAvailable?: number,
  borrowedByUser?: boolean
}

interface Props {
  books: Book[]
}

const BookList = ({ books }: Props) => {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <BookSummary
          key={book.id}
          id={book.id}
          title={book.title}
          authors={book.authors}
          publisher={book.publisher}
          edition={book.edition}
          publicationYear={book.publicationYear}
          copiesAvailable={book.copiesAvailable}
          borrowedByUser={book.borrowedByUser}
        />
      ))}
    </div>
  )
}

export default BookList