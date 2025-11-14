import React from 'react';
import LoanSummary from '../loanSummary/LoanSummary';

interface Loan {
  id: number;
  bookTitle: string;
  userName: string;
  loanDate: string;
  expectedReturnDate: string;
  returnDate?: string;
  status: string;
  isOverdue: boolean;
}

interface Props {
  loans: Loan[];
}

const LoanList = ({ loans }: Props) => {
  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <LoanSummary
          key={loan.id}
          id={loan.id}
          bookTitle={loan.bookTitle}
          userName={loan.userName}
          loanDate={loan.loanDate}
          expectedReturnDate={loan.expectedReturnDate}
          returnDate={loan.returnDate}
          status={loan.status}
          isOverdue={loan.isOverdue}
        />
      ))}
    </div>
  );
};

export default LoanList;
