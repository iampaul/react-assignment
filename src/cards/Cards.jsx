import { useCallback, useEffect, useState } from 'react';
import { fetchWrapper } from '_helpers';

export { Cards };

function Cards() {
    
    const baseUrl = `${process.env.REACT_APP_API_URL}`;
    const[cards,setCards] = useState({ loading: true });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCards();
    }, [currentPage]);

    const fetchCards = useCallback(async()=> {
        try {            
            const data = await fetchWrapper.get(`${baseUrl}/cards?page=${currentPage}&limit=${itemsPerPage}`)
            setCards(data.results);
            setTotalPages(data.totalPages);
        } catch (e) {
            setCards({error: true});
        }
    }, [currentPage])

    function handlePageChange(pageNumber) {        
        setCurrentPage(pageNumber);
    }
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div>            
            <h3>All Cards:</h3>
            {cards.length &&
                <div className="card">
                     <div className="card-body">                                             
                     <div className="tariffCards">
                        {cards.map(card =>
                            <div className={`credit-card selectable ${card.category === 'AE' ? 'american-express' : card.category === 'MC' ? 'mastercard' : 'visa'}`}>
                                <div className="credit-card-last4">
                                    {card.cardNumber.slice(-4)}
                                </div>
                                <div className="credit-card-holder">
                                    {card.cardHolder}
                                </div>
                                <div className="credit-card-expiry">
                                {card.cardExpiration}
                                </div>
                            </div>
                        )}
                    </div>
                    <ul className="pagination mt-2">
                        {pageNumbers.map(pageNumber => (
                        <li key={pageNumber}>
                             <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={pageNumber === currentPage}
                             >
                                {pageNumber}
                            </button>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>                
            }
            {cards.loading && <div className="spinner-border spinner-border-sm"></div>}
            {cards.error && <div className="text-danger">No cards found</div>}            
        </div>
    );
}
