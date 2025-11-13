import React from 'react'
import AvailabilityTag from '../availabilityTag/availabilityTag'

interface Props {
    id : number,
    title : string,
    authors : string[],
    publisher : string,
    edition: number,
    quantity?: number,
    copiesAvailable?: number,
    borrowedByUser?: boolean
}

const BookSummary = ({ id, title, authors, publisher, edition, quantity, copiesAvailable, borrowedByUser }: Props) => {
  const authorText = authors.length >= 3 ? `${authors[0]} et al.` : authors.join(', ');
  const isAvailable = copiesAvailable !== undefined && copiesAvailable > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 relative">
        {!borrowedByUser && copiesAvailable !== undefined && (
          <AvailabilityTag isAvailable={isAvailable} />
        )}
        <h3 className="text-xl font-bold text-gray-800 mb-1 pr-24">
            {title} <span className="font-normal text-xl text-gray-600">({edition}ª ed)</span> <span className="font-normal text-base text-gray-600">por {authorText}</span>
        </h3>
        <p className="text-gray-600 text-sm mb-0">Editora {publisher}</p>
        {borrowedByUser && <p className="text-blue-600 font-semibold text-sm mt-3 bg-blue-50 px-3 py-1 rounded inline-block">Emprestado por você</p>}
    </div>
  )
}

export default BookSummary